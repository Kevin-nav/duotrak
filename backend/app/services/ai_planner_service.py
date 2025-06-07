import google.generativeai as genai
from app.core.config import settings

class AIPlannerService:
    def __init__(self):
        if not settings.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY is not configured for the AI Planner.")
        
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-pro-latest')

    async def generate_system_plan_for_goal(self, goal_title: str, goal_description: str | None) -> str:
        """
        Generates a structured plan of systems for a given goal using the AI model.
        """
        prompt = f"""
        You are an expert productivity coach. A user wants to achieve the following goal.
        Your task is to break this goal down into a clear, concise, and actionable plan consisting of several "systems".
        A system is a repeatable action or habit.

        Goal Title: "{goal_title}"
        Goal Description: "{goal_description or 'No description provided.'}"

        Please provide a response in the following format:
        1.  **System Title:** A short, clear title for the first system (e.g., "Daily Morning Review").
            - **Description:** A simple, one-sentence description of what to do for this system.
            - **Metric:** Suggest a metric (e.g., "Binary (Done/Not Done)", "Duration (minutes)", "Counter (items)").
        2.  **System Title:** Title for the second system.
            - **Description:** Description for the second system.
            - **Metric:** Suggested metric.
        
        Provide 2-4 systems. The tone should be encouraging and straightforward.
        Focus on creating tangible, repeatable systems that will lead to achieving the main goal.
        """

        try:
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            # In a real app, handle this more gracefully
            raise Exception("Failed to generate a plan from the AI service.")

ai_planner_service = AIPlannerService() 