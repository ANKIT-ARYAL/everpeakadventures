import json
import subprocess
from pathlib import Path

models = [
    ("AboutPageContent", 'public."AboutPageContent"'),
    ("BlogPost", 'public."BlogPost"'),
    ("BlueBannerContent", 'public."BlueBannerContent"'),
    ("ClientReview", 'public."ClientReview"'),
    ("ContactInfo", 'public."ContactInfo"'),
    ("ContactSubmission", 'public."ContactSubmission"'),
    ("CtaBannerContent", 'public."CtaBannerContent"'),
    ("DirectorMessageContent", 'public."DirectorMessageContent"'),
    ("FAQ", 'public."FAQ"'),
    ("FixedDeparture", 'public."FixedDeparture"'),
    ("HeroContent", 'public."HeroContent"'),
    ("Page", 'public."Page"'),
    ("ResponsibleTravelContent", 'public."ResponsibleTravelContent"'),
    ("Section", 'public."Section"'),
    ("SiteSetting", 'public."SiteSetting"'),
    ("TeamMember", 'public."TeamMember"'),
    ("TermsPageContent", 'public."TermsPageContent"'),
    ("Tour", 'public."Tour"'),
    ("Trek", 'public."Trek"'),
    ("TrustItem", 'public."TrustItem"'),
    ("TrustedPartnerContent", 'public."TrustedPartnerContent"'),
    ("VideoBannerContent", 'public."VideoBannerContent"'),
    ("WelcomeContent", 'public."WelcomeContent"'),
    ("WhyChooseUsFeature", 'public."WhyChooseUsFeature"'),
    ("WhyChooseUsItem", 'public."WhyChooseUsItem"'),
    ("WhyPageContent", 'public."WhyPageContent"'),
]

out = {}
for model, table in models:
    sql = f'SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM {table}) t;'
    result = subprocess.run(
        ['docker', 'exec', '-i', 'everpeak_postgres', 'psql', '-U', 'postgres', '-d', 'everpeak_db', '-A', '-t', '-c', sql],
        capture_output=True,
        text=True,
        check=False,
    )
    payload = result.stdout.strip()
    if result.returncode != 0:
        print(f'Failed for {model}: {result.stderr}')
        out[model] = []
        continue
    out[model] = json.loads(payload) if payload and payload not in ('NULL', 'null') else []

Path('prisma').mkdir(exist_ok=True)
with open('prisma/live-data.json', 'w', encoding='utf-8') as fh:
    json.dump(out, fh, indent=2)

print('Wrote prisma/live-data.json')
