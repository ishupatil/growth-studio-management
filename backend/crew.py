import os
import gc

# Disable heavy telemetry before importing crewai
os.environ["OTEL_SDK_DISABLED"] = "true"
os.environ["CREWAI_TELEMETRY_OPT_OUT"] = "true"

from crewai import Agent, Task, Crew, Process

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

        # ── AGENT 1: Growth Strategist (Audit + Strategy) ─────
        strategist = Agent(
            role="Growth Strategist",
            goal="Audit account and create a 7-day strategy",
            backstory="Expert in Instagram analytics and algorithm growth.",
            llm=self.llm,
            verbose=False,
            allow_delegation=False,
        )

        audit_task = Task(
            description=f"Audit this account: {account_context}. Sections: Engagement, Strengths, Weaknesses, Projection.",
            agent=strategist,
            expected_output="Audit report.",
        )

        strategy_task = Task(
            description=f"Build a 7-day strategy for: {account_context}. Sections: Schedule, Mix, Engagement Tactics.",
            agent=strategist,
            expected_output="7-day strategy.",
            context=[audit_task],
        )

        # ── AGENT 2: Creative Director (Content + Captions) ───
        creative = Agent(
            role="Creative Director",
            goal="Generate content and captions for 7 days",
            backstory="Expert in viral hooks, content structure, and captions.",
            llm=self.llm,
            verbose=False,
            allow_delegation=False,
        )

        content_task = Task(
            description=f"Create a 7-day calendar for: {account_context}. Include hooks and outlines.",
            agent=creative,
            expected_output="7-day content calendar.",
            context=[strategy_task],
        )

        caption_task = Task(
            description=f"Write captions and 15 hashtags for all 7 days for: {account_context}.",
            agent=creative,
            expected_output="Captions and hashtags.",
            context=[content_task],
        )

        tips_task = Task(
            description=f"Provide 5 advanced tips for {self.username}. Goal: {self.goal}.",
            agent=creative,
            expected_output="5 growth tips.",
            context=[strategy_task, content_task],
        )

        # Force GC before starting heavy crew
        gc.collect()

        # ── BUILD AND RUN CREW ────────────────────────────────
        crew = Crew(
            agents=[strategist, creative],
            tasks=[audit_task, strategy_task, content_task, caption_task, tips_task],
            process=Process.sequential,
            verbose=False,
            memory=False,
            planning=False,
        )

        result = crew.kickoff()
        
        # Explicitly clean up to free memory
        import gc
        gc.collect()

        return {
            "audit_report": str(audit_task.output.raw) if audit_task.output else "",
            "growth_strategy": str(strategy_task.output.raw) if strategy_task.output else "",
            "content_calendar": str(content_task.output.raw) if content_task.output else "",
            "captions_hashtags": str(caption_task.output.raw) if caption_task.output else "",
            "extra_tips": str(tips_task.output.raw) if tips_task.output else "",
        }
