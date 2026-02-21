def build_medical_prompt(user_question, user_context, global_context, watch_data=None):

    user_section = "\n\n".join(user_context) if user_context else "No previous medical history found."
    global_section = "\n\n".join(global_context) if global_context else "No general medical knowledge found."
    
    # Build real-time watch data section
    watch_section = ""
    if watch_data:
        watch_items = []
        if watch_data.get('heartRate'):
            watch_items.append(f"- Heart Rate: {watch_data['heartRate']} bpm")
        if watch_data.get('steps'):
            watch_items.append(f"- Steps: {watch_data['steps']}")
        if watch_data.get('calories'):
            watch_items.append(f"- Calories Burned: {watch_data['calories']} kcal")
        if watch_data.get('sleep'):
            watch_items.append(f"- Sleep: {watch_data['sleep']} hours")
        if watch_data.get('bloodPressure'):
            watch_items.append(f"- Blood Pressure: {watch_data['bloodPressure']}")
        if watch_data.get('spO2'):
            watch_items.append(f"- SpO2: {watch_data['spO2']}%")
        if watch_data.get('temperature'):
            watch_items.append(f"- Temperature: {watch_data['temperature']}°C")
        
        if watch_items:
            watch_section = "\nReal-time Watch/Fitness Data:\n" + "\n".join(watch_items)

    prompt = f"""
You are a medical AI assistant providing personalized health guidance.

User Question:
{user_question}

User Medical History:
{user_section}

General Medical Knowledge:
{global_section}{watch_section}

Instructions:
- Consider the user's real-time watch/fitness data when analyzing the question.
- Personalize the response based on current health metrics and past medical history.
- If no past history, give general guidance.
- Be medically accurate and consider the current vital signs.
- Do NOT provide diagnosis.
- Encourage consulting a healthcare professional when necessary.
- Keep answer clear and structured.

Provide a helpful, personalized response based on all available information.
"""

    return prompt