import json
import random
from fbchat import Client
from fbchat.models import Message

# ডাটা ফাইল লোড করা
def load_json(file_name):
    try:
        with open(file_name, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

emoji_data = load_json('emojis.json')
cookies = load_json('appstate.json')

class EnafulBot(Client):
    def onMessage(self, author_id, message_object, thread_id, thread_type, **kwargs):
        # নিজের মেসেজে রিঅ্যাক্ট দিবে না
        if author_id == self.uid:
            return

        # শুধু গ্রুপ মেসেজ হলে রিঅ্যাক্ট দিবে
        if thread_type.name == "GROUP":
            try:
                react_list = emoji_data.get("reactList", ["❤️", "🔥", "👍"])
                random_emoji = random.choice(react_list)
                
                # মেসেজে রিঅ্যাকশন সেট করা
                self.reactToMessage(message_object.uid, random_emoji)
                print(f"Reacted {random_emoji} to message {message_object.uid}")
            except Exception as e:
                print(f"Error: {e}")

# লগইন প্রসেস
try:
    session_cookies = {c['key']: c['value'] for c in cookies}
    client = EnafulBot(' ', ' ', session_cookies=session_cookies)
    print("ENAFUL Bot (Python Version) is running...")
    client.listen()
except Exception as e:
    print(f"Login failed: {e}")
