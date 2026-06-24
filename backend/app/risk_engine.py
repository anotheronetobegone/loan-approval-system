from typing import Dict, List

def calculate_risk_score(amount: float, annual_income: float, employment_type: str) -> int:
    if annual_income <= 0 or amount <= 0:
        return 100

    ratio = amount / annual_income
    score = int(ratio * 100)

    if amount >= 50000:
        score += 15
    elif amount >= 25000:
        score += 8

    normalized_employment = employment_type.strip().lower()
    if normalized_employment in {'full-time', 'permanent', 'salaried'}:
        score = max(score - 10, 1)
    elif normalized_employment in {'contract', 'freelance', 'part-time', 'temporary'}:
        score += 10
    else:
        score += 5

    return max(1, min(100, score))


def build_score_snapshot(
    amount: float,
    annual_income: float,
    employment_type: str,
    education_signal: str | None = None,
    career_signal: str | None = None,
    monthly_income: float | None = None,
    monthly_expenses: float | None = None,
    co_applicant_credit_score: int | None = None,
) -> Dict[str, object]:
    risk_score = calculate_risk_score(amount, annual_income, employment_type)
    readiness_score = 60 + min(30, max(0, 100 - risk_score) // 3)

    if education_signal:
        readiness_score += 6
    if career_signal:
        readiness_score += 5
    if monthly_income and monthly_expenses:
        surplus = monthly_income - monthly_expenses
        if surplus > 600:
            readiness_score += 10
        elif surplus > 200:
            readiness_score += 6
        else:
            readiness_score -= 4
    if co_applicant_credit_score:
        readiness_score += 4

    credit_score = 650 + min(120, max(0, 100 - risk_score) * 2)
    trust_score = 70 + min(20, 10 + int((100 - risk_score) / 10))
    if education_signal:
        trust_score += 4
    if career_signal:
        trust_score += 3

    approval_probability = int(round((readiness_score * 0.45) + (credit_score / 1000 * 100 * 0.3) + (trust_score * 0.25)))
    approval_probability = max(20, min(95, approval_probability))

    reasons: List[str] = []
    recommendations: List[str] = []

    if readiness_score >= 80:
        reasons.append('Strong early-career and cash-flow signal')
    elif readiness_score >= 60:
        reasons.append('Approachable profile with moderate support signals')
    else:
        reasons.append('Cash-flow and trust signals need more support')

    if credit_score >= 740:
        reasons.append('Credit profile is healthy for a first-loan borrower')
    elif credit_score >= 680:
        reasons.append('Credit profile is acceptable and can improve with more history')
    else:
        reasons.append('Credit profile needs more positive history')

    if trust_score >= 80:
        reasons.append('Document and trust signals look strong')
    else:
        reasons.append('Trust signal would improve with extra document support')

    if monthly_income and monthly_expenses and monthly_income - monthly_expenses <= 200:
        recommendations.append('Reduce the requested amount or add a guarantor for better affordability')
    if not education_signal:
        recommendations.append('Add an education or training signal to strengthen readiness')
    if not career_signal:
        recommendations.append('Share a recent offer letter or proof of active income')
    if not co_applicant_credit_score:
        recommendations.append('Consider adding a co-applicant or guarantor for extra support')

    return {
        'risk_score': max(1, min(100, risk_score)),
        'readiness_score': max(1, min(100, readiness_score)),
        'credit_score': max(300, min(850, int(credit_score))),
        'trust_score': max(30, min(100, int(trust_score))),
        'approval_probability': approval_probability,
        'reasons': reasons,
        'recommendations': recommendations,
    }