import os
import gc

# Disable heavy telemetry before importing crewai
os.environ["OTEL_SDK_DISABLED"] = "true"
os.environ["CREWAI_TELEMETRY_OPT_OUT"] = "true"

from crewai import Agent, Task, Crew, Process
from langchain_groq import ChatGroq

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

        self.llm = ChatGroq(
            api_key=os.getenv("GROQ_API_KEY"),
            model="llama-3.1-8b-instant",
            temperature=0.7,
            max_tokens=1500,
        )

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
            # Direct LLM call — Bypassing heavy CrewAI execution engine to save ~200MB RAM
            print(">>> Calling Groq LLM directly (Lite Mode)...")
            response = self.llm.invoke(prompt)
            output_text = str(response.content)
            
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
