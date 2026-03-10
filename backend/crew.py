import os
import gc
from groq import Groq

class InstagramGrowthCrew:
    def __init__(
        self,
        username, followers, avg_likes, avg_comments,
        posting_frequency, content_type, brand_tone,
        goal, target_followers
    ):
        self.username = username
        self.followers = followers
        self.avg_likes = avg_likes
        self.avg_comments = avg_comments
        self.posting_frequency = posting_frequency
        self.content_type = content_type
        self.brand_tone = brand_tone
        self.goal = goal
        self.target_followers = target_followers
        self.engagement_rate = round(
            ((avg_likes + avg_comments) / max(followers, 1)) * 100, 2
        )

        # Initialize native Groq client (Zero overhead compared to LangChain/CrewAI)
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.1-8b-instant"


    def run(self):
        # Extreme Memory Protection: Force GC at very start
        gc.collect()

        prompt = f"""
        Instagram Account: @{self.username}
        Followers: {self.followers:,}
        Average Likes: {self.avg_likes}
        Average Comments: {self.avg_comments}
        Engagement Rate: {self.engagement_rate}%
        Weekly Posts: {self.posting_frequency}
        Content: {self.content_type}
        Tone: {self.brand_tone}
        Goal: {self.goal}
        Target: {self.target_followers:,}

        TASK: Provide a complete 7-day social media growth package.
        Be extremely concise and elite in your strategy.
        
        YOU MUST RETURN SECTIONS:
        - AUDIT: Quick analysis and projection.
        - STRATEGY: 3 main growth tactics.
        - CALENDAR: 7 days of content hooks and content types.
        - CAPTIONS & TIPS: Short captions for all 7 days, 5 hashtags/day, and 3 advanced growth tips.
        
        Keep total output brief to ensure fast processing.
        """

        try:
            # Direct API call via native Groq client for absolute minimum memory usage
            print(">>> Calling native Groq API (Ultra-Lite Mode)...")
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an elite, concise Social Media Architect. Provide exact, structured growth plans without fluff."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=1500,
            )
            output_text = response.choices[0].message.content
            
            # Post-call GC
            gc.collect()

            # Return structure compatible with app.py and frontend
            return {
                "audit_report": output_text,
                "growth_strategy": "Consolidated in the main report above.",
                "content_calendar": "Consolidated in the main report above.",
                "captions_hashtags": "Included in calendar above.",
                "extra_tips": "Included in calendar above.",
            }

        except Exception as e:
            print(f"ERROR in direct LLM call: {str(e)}")
            return {
                "audit_report": f"Generation Error: {str(e)}",
                "growth_strategy": "Error",
                "content_calendar": "Error",
                "captions_hashtags": "Error",
                "extra_tips": "Error",
            }
        finally:
            gc.collect()
