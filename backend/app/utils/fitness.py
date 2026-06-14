def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 1)


def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> float:
    if gender.lower() == "male":
        return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161


def calculate_tdee(bmr: float, activity_level: str) -> float:
    multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9,
    }
    return round(bmr * multipliers.get(activity_level, 1.2))


def calculate_protein_target(weight_kg: float, fitness_goal: str) -> float:
    multipliers = {"lose_fat": 2.2, "gain_muscle": 2.5, "maintain": 1.8}
    return round(weight_kg * multipliers.get(fitness_goal, 2.0))


def calculate_fitness_score(weight_logs: list, workout_logs: list, nutrition_logs: list) -> int:
    score = 50
    if len(weight_logs) >= 7:
        score += 10
    if len(workout_logs) >= 4:
        score += 20
    if len(nutrition_logs) >= 7:
        score += 20
    return min(score, 100)
