import { motion } from "framer-motion"
import { Brain, Smile, Sun, MessageSquare, Target, Heart, XCircle, Eye, Edit2, Zap, Coffee } from "lucide-react"
import { StepContainer, SelectionCard, SelectableChip } from "./onboarding-steps"
import { useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

// Personality Step
export function PersonalityStep({ selected, onToggle, onNext, onBack, step, totalSteps }: any) {
  const personalities = [
    { value: "Introvert", icon: Brain, description: "Prefers quiet, low-key environments" },
    { value: "Extrovert", icon: Smile, description: "Energized by social interactions" },
    { value: "Ambivert", icon: Sun, description: "Balanced between intro and extrovert" },
    { value: "Calm", icon: Zap, description: "Even-tempered and composed" },
    { value: "Funny", icon: Smile, description: "Has a great sense of humor" },
    { value: "Creative", icon: Brain, description: "Thinks outside the box" },
    { value: "Logical", icon: Brain, description: "Analytical and rational" },
    { value: "Empathetic", icon: Heart, description: "Understanding and compassionate" },
    { value: "Confident", icon: Zap, description: "Self-assured and determined" },
    { value: "Curious", icon: Eye, description: "Always eager to learn" },
  ]

  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={onNext}
      onBack={onBack}
      isValid={selected.length > 0}
      title="What's your personality like?"
      subtitle="Choose the traits that resonate with you. Multiple selections welcome."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalities.map((item) => (
          <SelectionCard
            key={item.value}
            icon={item.icon}
            label={item.value}
            description={item.description}
            isSelected={selected.includes(item.value)}
            onClick={() => onToggle(item.value)}
          />
        ))}
      </div>
    </StepContainer>
  )
}

// Interests Step
export function InterestsStep({ selected, onToggle, onNext, onBack, step, totalSteps }: any) {
  const [searchQuery, setSearchQuery] = useState("")
  
  const allInterests = [
    "Technology", "AI & Machine Learning", "Startups", "Entrepreneurship",
    "Music", "Movies", "Anime", "Gaming", "Esports",
    "Travel", "Photography", "Adventure", "Hiking",
    "Fitness", "Yoga", "Running", "Cycling",
    "Cooking", "Food", "Coffee", "Wine",
    "Books", "Writing", "Poetry", "Podcasts",
    "Art", "Design", "Fashion", "Architecture",
    "Sports", "Football", "Basketball", "Cricket",
    "Science", "Space", "Nature", "Environment",
    "Finance", "Investing", "Crypto", "NFTs",
    "Politics", "History", "Philosophy", "Psychology"
  ]

  const filteredInterests = searchQuery
    ? allInterests.filter(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    : allInterests

  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={onNext}
      onBack={onBack}
      isValid={selected.length > 0}
      title="What are you passionate about?"
      subtitle="Select your interests. Your Twin will use these to find like-minded people."
    >
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-4 pr-4 rounded-xl border-2 border-border bg-background text-foreground focus:border-[#156d95] focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto p-1">
        {filteredInterests.map((interest) => (
          <SelectableChip
            key={interest}
            label={interest}
            isSelected={selected.includes(interest)}
            onClick={() => onToggle(interest)}
          />
        ))}
      </div>

      {selected.length > 0 && (
        <div className="mt-6 p-4 bg-[#156d95]/10 rounded-xl border border-[#156d95]/20">
          <p className="text-sm text-muted-foreground mb-2">Selected: {selected.length} interests</p>
          <div className="flex flex-wrap gap-2">
            {selected.slice(0, 5).map((item: string) => (
              <Badge key={item} variant="secondary">{item}</Badge>
            ))}
            {selected.length > 5 && (
              <Badge variant="secondary">+{selected.length - 5} more</Badge>
            )}
          </div>
        </div>
      )}
    </StepContainer>
  )
}

// Lifestyle Step
export function LifestyleStep({ selected, onToggle, onNext, onBack, step, totalSteps }: any) {
  const lifestyles = [
    { value: "Early Bird", icon: Sun, description: "Wakes up early and loves mornings" },
    { value: "Night Owl", icon: Moon, description: "Most productive at night" },
    { value: "Vegetarian", icon: Coffee, description: "Plant-based diet" },
    { value: "Vegan", icon: Coffee, description: "No animal products" },
    { value: "Pet Lover", icon: Heart, description: "Loves animals" },
    { value: "Non-Smoker", icon: XCircle, description: "Doesn't smoke" },
    { value: "Frequent Traveller", icon: Zap, description: "Always exploring new places" },
    { value: "Homebody", icon: Coffee, description: "Enjoys staying in" },
    { value: "Minimalist", icon: Brain, description: "Less is more" },
    { value: "Maximalist", icon: Brain, description: "More is more" },
    { value: "Fitness Enthusiast", icon: Zap, description: "Active lifestyle" },
    { value: "Foodie", icon: Coffee, description: "Loves trying new cuisines" },
  ]

  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={onNext}
      onBack={onBack}
      isValid={selected.length > 0}
      title="Tell us about your lifestyle"
      subtitle="Help your Twin understand your daily habits and preferences."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lifestyles.map((item) => (
          <SelectionCard
            key={item.value}
            icon={item.icon}
            label={item.value}
            description={item.description}
            isSelected={selected.includes(item.value)}
            onClick={() => onToggle(item.value)}
          />
        ))}
      </div>
    </StepContainer>
  )
}

// Communication Style Step
export function CommunicationStyleStep({ selected, onToggle, onNext, onBack, step, totalSteps }: any) {
  const styles = [
    { value: "Friendly", icon: Smile, description: "Warm and approachable" },
    { value: "Direct", icon: Zap, description: "Straight to the point" },
    { value: "Thoughtful", icon: Brain, description: "Takes time to think" },
    { value: "Funny", icon: Smile, description: "Uses humor often" },
    { value: "Professional", icon: Brain, description: "Formal and structured" },
    { value: "Casual", icon: Coffee, description: "Relaxed and easygoing" },
    { value: "Listener", icon: MessageSquare, description: "Prefers to listen" },
    { value: "Talkative", icon: MessageSquare, description: "Loves conversation" },
  ]

  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={onNext}
      onBack={onBack}
      isValid={selected.length > 0}
      title="How do you communicate?"
      subtitle="Your Twin will mirror your communication style when connecting with others."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {styles.map((item) => (
          <SelectionCard
            key={item.value}
            icon={item.icon}
            label={item.value}
            description={item.description}
            isSelected={selected.includes(item.value)}
            onClick={() => onToggle(item.value)}
          />
        ))}
      </div>
    </StepContainer>
  )
}

// Goals Step
export function GoalsStep({ selected, onToggle, onNext, onBack, step, totalSteps }: any) {
  const goals = [
    { value: "Long-term Relationship", icon: Heart, description: "Looking for something serious" },
    { value: "Friends", icon: Smile, description: "Make new friends" },
    { value: "Networking", icon: Zap, description: "Professional connections" },
    { value: "Co-founder", icon: Target, description: "Find a business partner" },
    { value: "Study Partner", icon: Brain, description: "Learn together" },
    { value: "Travel Partner", icon: Zap, description: "Explore the world" },
    { value: "Gaming Buddy", icon: Smile, description: "Play games together" },
    { value: "Career Growth", icon: Target, description: "Professional development" },
    { value: "Mentorship", icon: Brain, description: "Learn from others" },
    { value: "Language Exchange", icon: MessageSquare, description: "Practice languages" },
  ]

  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={onNext}
      onBack={onBack}
      isValid={selected.length > 0}
      title="What are your goals?"
      subtitle="What would you like to achieve on TwinLink?"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((item) => (
          <SelectionCard
            key={item.value}
            icon={item.icon}
            label={item.value}
            description={item.description}
            isSelected={selected.includes(item.value)}
            onClick={() => onToggle(item.value)}
          />
        ))}
      </div>
    </StepContainer>
  )
}

// Relationship Intent Step
export function RelationshipIntentStep({ selected, onToggle, onNext, onBack, step, totalSteps }: any) {
  const intents = [
    { value: "Dating", icon: Heart },
    { value: "Friendship", icon: Smile },
    { value: "Professional", icon: Brain },
    { value: "Business", icon: Target },
    { value: "Study", icon: Brain },
    { value: "Travel", icon: Zap },
    { value: "Gaming", icon: Smile },
    { value: "Casual", icon: Coffee },
  ]

  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={onNext}
      onBack={onBack}
      isValid={selected.length > 0}
      title="What type of connections?"
      subtitle="Select all that apply. You can connect with people for multiple reasons."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {intents.map((item) => (
          <motion.button
            key={item.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(item.value)}
            className={`
              aspect-square rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border-2 transition-all
              ${selected.includes(item.value)
                ? "border-[#156d95] bg-[#156d95]/10"
                : "border-border bg-card hover:border-[#156d95]/50"
              }
            `}
          >
            <item.icon className={`w-8 h-8 ${selected.includes(item.value) ? "text-[#156d95]" : "text-muted-foreground"}`} />
            <span className={`font-medium text-sm ${selected.includes(item.value) ? "text-[#156d95]" : "text-foreground"}`}>
              {item.value}
            </span>
          </motion.button>
        ))}
      </div>
    </StepContainer>
  )
}

// Deal Breakers Step
export function DealBreakersStep({ selected, onToggle, onNext, onBack, step, totalSteps }: any) {
  const dealBreakers = [
    "Smoking", "Dishonesty", "Poor Communication", "No Long-Term Goals",
    "Negative Attitude", "Lack of Respect", "Poor Hygiene", "Arrogance",
    "Lack of Ambition", "Closed-Mindedness", "Drama", "Flakiness"
  ]

  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={onNext}
      onBack={onBack}
      isValid={true}
      title="Any deal breakers?"
      subtitle="Optional: Let your Twin know what to avoid. This helps filter incompatible connections."
    >
      <div className="flex flex-wrap gap-3">
        {dealBreakers.map((item) => (
          <SelectableChip
            key={item}
            label={item}
            isSelected={selected.includes(item)}
            onClick={() => onToggle(item)}
          />
        ))}
      </div>

      {selected.length === 0 && (
        <div className="mt-6 p-4 bg-muted/50 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            No deal breakers selected. You can skip this step or select what matters to you.
          </p>
        </div>
      )}
    </StepContainer>
  )
}

function Moon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
  )
}
