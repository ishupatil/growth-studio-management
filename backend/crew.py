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
        # Force GC at start
        gc.collect()

        account_context = f"""
        Instagram Account: @{self.username}
        Followers: {self.followers:,}
        Average Likes: {self.avg_likes}
        Average Comments: {self.avg_comments}
        Engagement Rate: {self.engagement_rate}%
        Posts Per Week: {self.posting_frequency}
        Content Type: {self.content_type}
        Brand Tone: {self.brand_tone}
        Goal: {self.goal}
        Target Followers: {self.target_followers:,}
        """

        # ── THE OMNI-AGENT: Growth Maestro ───────────────────
        maestro = Agent(
            role="Growth Maestro",
            goal="Provide a complete growth audit, strategy, and 7-day content plan in one pass",
            backstory="The world's most efficient social media architect. Expert in high-impact growth and viral content.",
            llm=self.llm,
            verbose=True,
            allow_delegation=False,
        )

        # THE SINGLE OMNI-TASK
        omni_task = Task(
            description=f"""
            Perform a complete growth service for: {account_context}.
            
            YOU MUST PROVIDE ALL 4 SECTIONS IN ONE RESPONSE:
            1. AUDIT: Brief engagement analysis and projection.
            2. STRATEGY: High-level 7-day growth tactics.
            3. CONTENT CALENDAR: A 7-day daily schedule with specific hooks.
            4. CAPTIONS & TIPS: Short captions for all 7 days, 5 hashtags/day, and 3 advanced tips.
            
            Keep the total response concise, professional, and data-driven.
            """,
            agent=maestro,
            expected_output="A complete, well-structured growth package including Audit, Strategy, 7-day Content Calendar, Captions, and Tips.",
        )

        # ── BUILD AND RUN OMNI-CREW ──────────────────────────
        crew = Crew(
            agents=[maestro],
            tasks=[omni_task],
            process=Process.sequential,
            verbose=True,
            memory=False,
            planning=False,
        )

        result = crew.kickoff()
        
        # Final GC
        gc.collect()

        # Map everything to ensure frontend compatibility
        output_text = str(result.raw) if result else "Generation failed."
        
        return {
            "audit_report": output_text, # Returning full text to all for safety
            "growth_strategy": "See full report above.",
            "content_calendar": "See full report above.",
            "captions_hashtags": "See full report above.",
            "extra_tips": "See full report above.",
        }
