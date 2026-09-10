import {
  Backpack, Bandage, Bath, BatteryCharging, BriefcaseMedical, Camera,
  Check, ChevronDown, Droplets, Flashlight, Footprints, Glasses,
  Hand, HatGlasses, Pill, Shirt, Tent, Thermometer, type LucideIcon,
} from "lucide-react";
import { stripHtml, toHtml } from "@/app/lib/html";

type Preparation = {
  highlights: string;
  medication: string[];
  clothing: string[];
  equipment: string[];
  introduction: string;
};

const clothingPattern = /\b(boots?|shoes?|sandals?|socks?|pants?|trousers?|shirts?|t-shirts?|jackets?|thermals?|fleeces?|hats?|beanies?|gloves?|mittens?|neck warmer|gaiters?|underwear|clothing|headwear|footwear)\b/i;

export function extractTrekPreparation(value: string | null | undefined): Preparation {
  const result: Preparation = {
    highlights: toHtml(value), medication: [], clothing: [], equipment: [], introduction: "",
  };
  // Accept editor lists and imported paragraphs without consuming adjacent highlights.
  const heading = /<(p|h[2-6])\b[^>]*>\s*(?:<(?:strong|b)\b[^>]*>\s*)?(Medication(?:s)?|Clothing\s*\/\s*Equipment\s+List|Clothing(?:\s+List)?|Equipment(?:\s+List)?)\s*(?:<\/(?:strong|b)>\s*)?<\/\1>/gi;
  const source = result.highlights;
  const sections = Array.from(source.matchAll(heading));
  for (const section of sections.reverse()) {
    const start = section.index!;
    let end = start + section[0].length;
    const entries: string[] = [];
    let introduction = "";
    while (end < source.length) {
      const block = /^\s*<(p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/i.exec(source.slice(end));
      if (!block) break;
      const [, tag, content] = block;
      if (tag.toLowerCase() !== "p") {
        entries.push(...Array.from(content.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi), match => stripHtml(match[1])).filter(Boolean));
      } else {
        const text = stripHtml(content);
        if (!text) {
          // Imported editors often leave empty bold paragraphs before a list.
        } else if (/^[-–—•]/.test(text)) {
          entries.push(...content.split(/<br\s*\/?>/i).map(line => stripHtml(line).replace(/^[-–—•]\s*/, "")).filter(Boolean));
        } else if (!entries.length && !introduction && /^kindly bring\b/i.test(text)) {
          introduction = block[0];
        } else break;
      }
      end += block[0].length;
    }
    if (!entries.length) continue;
    if (/medication/i.test(section[2])) result.medication.unshift(...entries);
    else {
      result.introduction = introduction + result.introduction;
      const clothing: string[] = [];
      const equipment: string[] = [];
      for (const entry of entries) {
        const isClothing = /clothing/i.test(section[2]) && (!/equipment/i.test(section[2]) || clothingPattern.test(entry));
        (isClothing ? clothing : equipment).push(entry);
      }
      result.clothing.unshift(...clothing);
      result.equipment.unshift(...equipment);
    }
    result.highlights = result.highlights.slice(0, start) + result.highlights.slice(end);
  }
  return result;
}

function itemIcon(name: string, fallback: LucideIcon): LucideIcon {
  const icons: [RegExp, LucideIcon][] = [
    [/bandage|plaster|band-aid|moleskin|blister|ointment/i, Bandage],
    [/\b(iodine|water|salts|filter)\b/i, Droplets],
    [/boots?|shoes?|sandals?|socks?/i, Footprints],
    [/sunglasses|glasses/i, Glasses],
    [/hat|beanie|neck warmer/i, HatGlasses],
    [/gloves?|mittens?/i, Hand],
    [/thermals?/i, Thermometer],
    [/rucksack|backpack|daypack/i, Backpack],
    [/camera|film/i, Camera],
    [/torch|headlamp/i, Flashlight],
    [/batter|charger|power bank/i, BatteryCharging],
    [/sleeping|liner|tent/i, Tent],
    [/soap|shampoo|towel|tissue|sunscreen|ointment/i, Bath],
  ];
  return icons.find(([pattern]) => pattern.test(name))?.[1] ?? fallback;
}

function ItemGrid({ items, icon }: { items: string[]; icon: LucideIcon }) {
  return (
    <ul className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = itemIcon(item, icon);
        return (
          <li key={`${item}-${index}`} className="flex min-w-0 items-start gap-3.5">
            <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 stroke-[1.5] text-gray-700 sm:h-6 sm:w-6" />
            <span className="min-w-0 flex-1 break-words text-sm font-semibold leading-relaxed text-[#112233] sm:text-[15px]">{item}</span>
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={3} />
          </li>
        );
      })}
    </ul>
  );
}

export default function TrekPreparationSections({ preparation }: { preparation: Preparation }) {
  return (
    <>
      {(["medication", "clothing", "equipment"] as const).map(category => {
        const items = preparation[category];
        if (!items.length) return null;
        const Icon = category === "medication" ? BriefcaseMedical : category === "clothing" ? Shirt : Backpack;
        return (
          <details key={category} id={`trek-${category}`} className="group min-w-0 rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-6 md:p-8">
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-sm text-base font-bold uppercase tracking-wide text-[#112233] sm:text-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#1e857c] [&::-webkit-details-marker]:hidden">
              <Icon aria-hidden="true" className="h-5 w-5 shrink-0 stroke-[1.5] text-gray-700 sm:h-6 sm:w-6" />
              {category}
              <ChevronDown aria-hidden="true" className="ml-auto h-5 w-5 shrink-0 text-[#1e857c] transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-6">
              {category === "equipment" && preparation.introduction && (
                <div className="mb-4 text-sm leading-relaxed text-gray-600" dangerouslySetInnerHTML={{ __html: preparation.introduction }} />
              )}
              <ItemGrid items={items} icon={category === "medication" ? Pill : Icon} />
            </div>
          </details>
        );
      })}
    </>
  );
}
