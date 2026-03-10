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

        # ── AGENT 1: Growth Strategist ────────────────────────
        strategist = Agent(
            role="Growth Strategist",
            goal="Perform a quick audit and create a 7-day strategy",
            backstory="Expert in Instagram analytics and algorithm growth. Known for being extremely concise and data-driven.",
            llm=self.llm,
            verbose=True,
            allow_delegation=False,
        )

        # Consolidated Audit + Strategy
        strategy_task = Task(
            description=f"Audit this account AND build a 7-day strategy: {account_context}. Keep it concise. Focus on: Engagement audit, Projection, and a 7-day Schedule.",
            agent=strategist,
            expected_output="A concise combined report containing a profile audit and a 7-day growth strategy.",
        )

        # ── AGENT 2: Creative Director ────────────────────────
        creative = Agent(
            role="Creative Director",
            goal="Generate content, captions, and growth tips",
            backstory="Expert in viral hooks and content structure. Master of brevity.",
            llm=self.llm,
            verbose=True,
            allow_delegation=False,
        )

        # Consolidated Content + Captions + Tips (The "Final Package")
        final_package_task = Task(
            description=f"Create a 7-day calendar with captions and 5 targeted hashtags for: {account_context}. Also include 3 advanced growth tips. BASE THIS ON THE STRATEGY: {{strategy_task.output}}",
            agent=creative,
            expected_output="7-day content calendar including captions, 5 hashtags per day, and 3 growth tips.",
            context=[strategy_task],
        )

        # Force GC before starting heavy crew
        gc.collect()

        # ── BUILD AND RUN CREW ────────────────────────────────
        crew = Crew(
            agents=[strategist, creative],
            tasks=[strategy_task, final_package_task],
            process=Process.sequential,
            verbose=True,
            memory=False,
            planning=False,
        )

        result = crew.kickoff()
        
        # Explicitly clean up to free memory
        gc.collect()

        # Parse the result back into the expected frontend format
        # Since we consolidated, we'll map the outputs back
        full_output = str(result.raw) if result else ""
        
        return {
            "audit_report": str(strategy_task.output.raw) if strategy_task.output else "Audit/Strategy combined above.",
            "growth_strategy": str(strategy_task.output.raw) if strategy_task.output else "",
            "content_calendar": str(final_package_task.output.raw) if final_package_task.output else "",
            "captions_hashtags": "Included in Content Calendar above.",
            "extra_tips": "Included in Content Calendar above.",
        }
