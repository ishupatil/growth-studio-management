from crewai import Agent, Task, Crew, Process
from langchain_groq import ChatGroq
import os

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

        # ── AGENT 1: Audit Specialist ──────────────────────────
        audit_agent = Agent(
            role="Instagram Audit Specialist",
            goal="Analyze performance and identify growth opportunities",
            backstory="Expert in Instagram analytics and growth patterns.",
            llm=self.llm,
            verbose=False,
            allow_delegation=False,
        )

        audit_task = Task(
            description=f"""
            Audit this Instagram account and produce a report.
            {account_context}
            Sections: ENGAGEMENT ANALYSIS, STRENGTHS (3 points), WEAKNESSES (3 points), 
            GROWTH OPPORTUNITIES (3 points), GROWTH PROJECTION.
            """,
            agent=audit_agent,
            expected_output="Structured audit report.",
        )

        # ── AGENT 2: Strategy Planner ──────────────────────────
        strategy_agent = Agent(
            role="Instagram Strategy Planner",
            goal="Create a 7-day growth strategy",
            backstory="Expert in Instagram algorithm and engagement momentum.",
            llm=self.llm,
            verbose=False,
            allow_delegation=False,
        )

        strategy_task = Task(
            description=f"""
            Build a 7-day strategy.
            {account_context}
            Sections: POSTING SCHEDULE, CONTENT MIX, ENGAGEMENT TACTICS, 
            ALGORITHM TACTICS, PROFILE OPTIMIZATION.
            """,
            agent=strategy_agent,
            expected_output="Complete 7-day growth strategy.",
            context=[audit_task],
        )

        # ── AGENT 3: Content creation Expert ──────────────────
        content_agent = Agent(
            role="Instagram Content Expert",
            goal="Generate a specific 7-day content calendar",
            backstory="Specialist in viral hooks and content structure.",
            llm=self.llm,
            verbose=False,
            allow_delegation=False,
        )

        content_task = Task(
            description=f"""
            Create a 7-day content calendar.
            {account_context}
            For Days 1-7: Post Type, Idea, Hook, Outline, Goal, Time.
            """,
            agent=content_agent,
            expected_output="7-day content calendar.",
            context=[strategy_task],
        )

        # ── AGENT 4: Caption & Hashtag Specialist ─────────────
        caption_agent = Agent(
            role="Instagram Caption Specialist",
            goal="Write captions and optimized hashtag sets",
            backstory="Expert in conversion-driven captions and hashtag layering.",
            llm=self.llm,
            verbose=False,
            allow_delegation=False,
        )

        caption_task = Task(
            description=f"""
            Write captions and hashtags for all 7 days.
            {account_context}
            For Days 1-7: Full caption (brand tone), 15 hashtags (broad/niche/micro).
            """,
            agent=caption_agent,
            expected_output="Captions and 15 hashtags for all 7 days.",
            context=[content_task],
        )

        # ── EXTRA TIPS TASK ───────────────────────────────────
        tips_task = Task(
            description=f"""
            Provide 5 advanced growth tips for @{self.username}.
            Goal: {self.goal}. Target: {self.target_followers}.
            """,
            agent=caption_agent,
            expected_output="5 growth tips.",
            context=[strategy_task, content_task],
        )

        # ── BUILD AND RUN CREW ────────────────────────────────
        crew = Crew(
            agents=[audit_agent, strategy_agent, content_agent, caption_agent],
            tasks=[audit_task, strategy_task, content_task, caption_task, tips_task],
            process=Process.sequential,
            verbose=False,
            memory=False,
            planning=False, # Disable new resource-heavy planning feature
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
