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
            goal="Analyze Instagram account performance and identify growth opportunities",
            backstory="""You are a data-driven Instagram analytics expert 
            with deep knowledge of engagement benchmarks, algorithm 
            behavior, and growth patterns across all content niches. 
            Your audits are specific, honest, and actionable.""",
            llm=self.llm,
            verbose=False,
            allow_delegation=False,
        )

        audit_task = Task(
            description=f"""
            Audit this Instagram account and produce a structured report.

            {account_context}

            Include these exact sections:

            ENGAGEMENT ANALYSIS:
            Rate {self.engagement_rate}% and classify it.
            Benchmark against {self.content_type} niche average.

            STRENGTHS (exactly 3 bullet points):
            Specific to their data above.

            WEAKNESSES (exactly 3 bullet points):
            Specific to their data above.

            GROWTH OPPORTUNITIES (exactly 3 bullet points):
            Specific to {self.content_type} and goal: {self.goal}.

            GROWTH PROJECTION:
            Current timeline to {self.target_followers:,} followers.
            Optimized timeline with strategy.
            Top priority fix.
            """,
            agent=audit_agent,
            expected_output="Structured audit report with all 5 sections.",
        )

        # ── AGENT 2: Strategy Planner ──────────────────────────
        strategy_agent = Agent(
            role="Instagram Growth Strategy Planner",
            goal="Create a data-backed 7-day Instagram growth strategy",
            backstory="""You are an Instagram growth expert who has 
            scaled hundreds of accounts. You understand the 2025 
            algorithm deeply — what content gets pushed, when to post, 
            and how to build compounding engagement momentum.""",
            llm=self.llm,
            verbose=False,
            allow_delegation=False,
        )

        strategy_task = Task(
            description=f"""
            Build a 7-day growth strategy for this account.

            {account_context}

            Cover these sections:

            POSTING SCHEDULE:
            Day-by-day posting times (EST).
            Reasoning for each time slot.

            CONTENT MIX:
            Exact % split: Reels / Carousels / Stories / Static.
            Justification for each.

            ENGAGEMENT TACTICS:
            Comment reply strategy and timing.
            Story engagement loops.
            Collaboration opportunities for {self.content_type}.

            ALGORITHM TACTICS:
            3 specific tactics to boost reach for {self.goal}.
            How to trigger explore page.

            PROFILE OPTIMIZATION:
            Bio improvements.
            Highlights strategy.
            """,
            agent=strategy_agent,
            expected_output="Complete 7-day growth strategy with all sections.",
            context=[audit_task],
        )

        # ── AGENT 3: Content Creation Expert ──────────────────
        content_agent = Agent(
            role="Instagram Content Creation Expert",
            goal="Generate a specific and creative 7-day content calendar",
            backstory="""You are a viral content strategist who has 
            created content for top creators in every niche. You know 
            exactly what hooks stop the scroll, what formats drive saves, 
            and how to structure content that converts viewers to followers.""",
            llm=self.llm,
            verbose=False,
            allow_delegation=False,
        )

        content_task = Task(
            description=f"""
            Create a 7-day content calendar for this account.

            {account_context}

            For EVERY day from Day 1 to Day 7 include:

            DAY [N]:
            Post Type: Reel / Carousel / Story / Static
            Content Idea: Specific idea for {self.content_type}
            Hook: First line that stops the scroll
            Outline: 3-4 bullet points (script for Reels, slides for Carousels)
            Goal: Reach / Engagement / Saves / Follows
            Post Time: Specific time EST

            Do not skip any day. All 7 days required.
            """,
            agent=content_agent,
            expected_output="Complete 7-day content calendar, all days covered.",
            context=[strategy_task],
        )

        # ── AGENT 4: Caption & Hashtag Specialist ─────────────
        caption_agent = Agent(
            role="Instagram Caption and Hashtag Specialist",
            goal="Write high-converting captions and optimized hashtag sets",
            backstory="""You are a copywriting expert who specializes 
            in Instagram captions that drive action. Your hashtag 
            methodology layers broad, niche, and micro tags to maximize 
            both reach and relevance for any content type.""",
            llm=self.llm,
            verbose=False,
            allow_delegation=False,
        )

        caption_task = Task(
            description=f"""
            Write captions and hashtags for all 7 days.

            {account_context}

            For EVERY day from Day 1 to Day 7 provide:

            DAY [N] CAPTION:
            Full caption in {self.brand_tone} tone.
            4-5 lines with emoji.
            Strong CTA aligned with {self.goal}.

            DAY [N] HASHTAGS:
            5 broad hashtags (1M+ posts)
            5 niche hashtags (100K-1M posts)
            5 micro hashtags (under 100K posts)
            Total: exactly 15 hashtags per day.

            Do not skip any day. All 7 days required.
            """,
            agent=caption_agent,
            expected_output="Captions and 15 hashtags for all 7 days.",
            context=[content_task],
        )

        # ── EXTRA TIPS TASK (same caption agent) ──────────────
        tips_task = Task(
            description=f"""
            Based on the full strategy created for @{self.username},
            provide 5 advanced growth tips.

            Account has {self.followers:,} followers in {self.content_type}.
            Goal: {self.goal}
            Target: {self.target_followers:,} followers

            Format:
            TIP 1: [Title]
            [2-3 specific sentences. Reference their exact situation.]

            TIP 2: [Title]
            [2-3 specific sentences.]

            Continue for all 5 tips.
            No generic advice. Everything must be niche-specific.
            """,
            agent=caption_agent,
            expected_output="5 advanced, account-specific growth tips.",
            context=[strategy_task, content_task],
        )

        # ── BUILD AND RUN CREW ────────────────────────────────
        crew = Crew(
            agents=[audit_agent, strategy_agent, content_agent, caption_agent],
            tasks=[audit_task, strategy_task, content_task, caption_task, tips_task],
            process=Process.sequential,
            verbose=False,
        )

        result = crew.kickoff()

        # Extract outputs from each task
        return {
            "audit_report": str(audit_task.output.raw) if audit_task.output else "",
            "growth_strategy": str(strategy_task.output.raw) if strategy_task.output else "",
            "content_calendar": str(content_task.output.raw) if content_task.output else "",
            "captions_hashtags": str(caption_task.output.raw) if caption_task.output else "",
            "extra_tips": str(tips_task.output.raw) if tips_task.output else "",
        }
