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
