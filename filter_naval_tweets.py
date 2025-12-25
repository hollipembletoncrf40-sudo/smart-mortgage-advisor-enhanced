import json
import re

# Load tweets
with open('tweets_naval_2016-01-01_to_2025-12-24.json', 'r', encoding='utf-8') as f:
    tweets = json.load(f)

print(f"Total tweets: {len(tweets)}")

# Keywords for filtering meaningful content
keywords = [
    # Entrepreneurship / Startups
    'startup', 'founder', 'entrepreneur', 'company', 'business', 'product',
    'investor', 'investing', 'investment', 'venture', 'capital', 'equity',
    'market', 'customer', 'scale', 'growth', 'revenue', 'profit',
    'recruiting', 'hiring', 'team', 'employee', 'talent',
    
    # Wealth
    'wealth', 'money', 'rich', 'income', 'asset', 'leverage', 'ownership',
    'financial', 'freedom', 'compound', 'passive', 'equity',
    'specific knowledge', 'leverage', 'accountability',
    
    # Life guidance / Wisdom
    'happiness', 'happy', 'meaning', 'purpose', 'life', 'wisdom',
    'truth', 'honest', 'integrity', 'authentic', 'peace', 'calm',
    'mindful', 'meditation', 'awareness', 'consciousness',
    'decision', 'choice', 'priority', 'focus', 'intention',
    'time', 'energy', 'attention', 'habit', 'discipline',
    
    # Virtue / Character
    'virtue', 'character', 'ethics', 'moral', 'trust', 'reputation',
    'humble', 'curious', 'patient', 'courage', 'honest', 'kind',
    'generous', 'grateful', 'forgive', 'empathy', 'compassion',
    
    # Learning / Growth
    'learn', 'read', 'book', 'knowledge', 'understand', 'think',
    'education', 'skill', 'master', 'practice', 'improve', 'grow',
    
    # Philosophy
    'philosophy', 'stoic', 'buddhism', 'zen', 'tao', 'nature',
    'reality', 'illusion', 'ego', 'desire', 'suffering', 'attachment'
]

def is_meaningful(tweet):
    text = tweet.get('text', '').lower()
    
    # Skip pure replies (starting with @) unless long
    if text.startswith('@') and len(text) < 150:
        return False
    
    # Skip retweets
    if text.startswith('rt @'):
        return False
    
    # Skip short tweets that are just links or emojis
    if len(text) < 50:
        return False
    
    # Long-form tweets are always interesting (Naval's tweetstorms)
    if len(text) > 500:
        return True
    
    # High engagement tweets
    metrics = tweet.get('metrics', {})
    like_count = metrics.get('like_count', 0)
    retweet_count = metrics.get('retweet_count', 0)
    
    # Very high engagement
    if like_count > 5000 or retweet_count > 500:
        return True
    
    # Check for keywords
    for keyword in keywords:
        if keyword in text:
            # Medium engagement + keyword
            if like_count > 500 or retweet_count > 50:
                return True
            # Very relevant keyword in longer text
            if len(text) > 100:
                return True
    
    return False

# Filter meaningful tweets
meaningful_tweets = []
for tweet in tweets:
    if is_meaningful(tweet):
        meaningful_tweets.append({
            'id': tweet.get('id'),
            'text': tweet.get('text'),
            'created_at': tweet.get('created_at'),
            'likes': tweet.get('metrics', {}).get('like_count', 0),
            'retweets': tweet.get('metrics', {}).get('retweet_count', 0),
            'views': tweet.get('metrics', {}).get('view_count', 0)
        })

# Sort by likes (most popular first)
meaningful_tweets.sort(key=lambda x: x['likes'], reverse=True)

print(f"Filtered meaningful tweets: {len(meaningful_tweets)}")

# Save to new file
with open('naval_wisdom_selected.json', 'w', encoding='utf-8') as f:
    json.dump(meaningful_tweets, f, ensure_ascii=False, indent=2)

print("Saved to naval_wisdom_selected.json")

# Also create a markdown version for easy reading
with open('naval_wisdom_selected.md', 'w', encoding='utf-8') as f:
    f.write("# Naval Ravikant - 精选智慧语录\n\n")
    f.write("精选自Naval Twitter的创业、人生、财富、品德相关高质量内容\n\n---\n\n")
    
    for i, tweet in enumerate(meaningful_tweets[:200], 1):  # Top 200
        text = tweet['text']
        date = tweet['created_at'][:10] if tweet['created_at'] else 'Unknown'
        likes = tweet['likes']
        
        f.write(f"## {i}. [{date}] ❤️ {likes:,}\n\n")
        f.write(f"{text}\n\n")
        f.write("---\n\n")

print("Saved top 200 to naval_wisdom_selected.md")
