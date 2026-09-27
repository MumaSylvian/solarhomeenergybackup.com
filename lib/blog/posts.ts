/**
 * Blog guides. Content is plain data so pages, schema, the sitemap, and
 * llms.txt all read from one place.
 *
 * Inline links use [label](/path) or [label](https://…). Worked examples use
 * round, clearly labelled example numbers; readers are told to check their own
 * appliance labels and product spec sheets.
 */

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; caption: string; head: string[]; rows: string[][] }
  | { type: 'note'; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  /** Meta description, 120–155 characters. */
  description: string;
  /** 40–60 word direct answer shown first; used by snippets and AI answers. */
  answer: string;
  published: string;
  updated: string;
  /** Storefront category labels this guide supports (for cross-links). */
  categories: string[];
  shopLinks: { label: string; href: string }[];
  blocks: BlogBlock[];
  faqs: { question: string; answer: string }[];
  sources: { name: string; url: string }[];
};

const doeEstimating = {
  name: 'U.S. Department of Energy, Energy Saver: Estimating Appliance and Home Electronic Energy Use',
  url: 'https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use',
};
const cpscGenerators = {
  name: 'U.S. Consumer Product Safety Commission: Portable Generator Hazards',
  url: 'https://www.cpsc.gov/safety-education/safety-guides/carbon-monoxide/portable-generator-hazards',
};
const ftcEnergyGuide = {
  name: 'Federal Trade Commission: How To Use the EnergyGuide Label To Shop for Home Appliances',
  url: 'https://consumer.ftc.gov/articles/how-use-energyguide-label-shop-home-appliances',
};
const nrelPvwatts = {
  name: 'National Renewable Energy Laboratory: PVWatts Calculator',
  url: 'https://pvwatts.nrel.gov/',
};

export const posts: BlogPost[] = [
  {
    slug: 'how-to-size-a-home-battery-backup',
    title: 'How to size a battery backup system for your home',
    description:
      'Work out the inverter watts and battery watt-hours your home needs during an outage, with a worked example you can copy for your own appliances.',
    answer:
      'Size a home battery backup in two steps. Add the running watts of everything you want on at the same time; that sets the inverter output. Then multiply each device’s watts by the hours it will run and add them up; that sets the battery capacity in watt-hours. Add about 20% for losses and reserve.',
    published: '2026-09-25',
    updated: '2026-09-25',
    categories: ['Whole-home backup', 'Batteries', 'Portable power'],
    shopLinks: [
      { label: 'Whole-home backup systems', href: '/whole-home-backup' },
      { label: 'Batteries', href: '/batteries' },
      { label: 'Portable power stations', href: '/portable-power' },
    ],
    blocks: [
      { type: 'h2', id: 'two-numbers', text: 'Which two numbers decide the size of a backup system?' },
      {
        type: 'p',
        text: 'Every battery backup has an output rating in watts (W) and a storage rating in watt-hours (Wh) or kilowatt-hours (kWh). Watts are how much power it can deliver at one moment. Watt-hours are how long it can keep delivering. A system with plenty of storage but a small inverter will shut off when you start the microwave; a large inverter on a small battery will run everything for an hour and then go dark.',
      },
      {
        type: 'p',
        text: 'So you size them separately. Output comes from the loads that run at the same time. Capacity comes from the energy those loads use over the length of the outage you are planning for.',
      },
      { type: 'h2', id: 'list-loads', text: 'How do I find out what my appliances use?' },
      {
        type: 'p',
        text: 'Look for the wattage on the appliance nameplate, in the manual, or on the power adapter. If only amps are listed, multiply amps by the voltage (120 V for a standard US outlet) to get watts. For energy use, the Department of Energy’s formula is simple: watts × hours used per day ÷ 1,000 = kilowatt-hours per day.',
      },
      {
        type: 'p',
        text: 'Refrigerators and freezers need one adjustment. Their compressors cycle on and off, so the DOE suggests dividing the time they are plugged in by three to estimate how long they actually run at full wattage. Twenty-four hours plugged in becomes about eight hours of running time.',
      },
      { type: 'h2', id: 'worked-example', text: 'What does a worked example look like?' },
      {
        type: 'p',
        text: 'Here is a 24-hour plan for keeping the essentials on in a typical home. The wattages are round example figures; swap in the numbers from your own labels.',
      },
      {
        type: 'table',
        caption: 'Example 24-hour essential load plan',
        head: ['Appliance', 'Running watts', 'Hours per day', 'Watt-hours'],
        rows: [
          ['Refrigerator (24 h ÷ 3)', '150 W', '8', '1,200 Wh'],
          ['Chest freezer (24 h ÷ 3)', '100 W', '8', '800 Wh'],
          ['LED lights, 6 bulbs at 10 W', '60 W', '6', '360 Wh'],
          ['Modem and Wi-Fi router', '20 W', '24', '480 Wh'],
          ['TV', '100 W', '4', '400 Wh'],
          ['Laptop and phone charging', '65 W', '3', '195 Wh'],
          ['Total', '495 W', '', '3,435 Wh'],
        ],
      },
      {
        type: 'p',
        text: 'The inverter needs to cover 495 W if everything happens to run at once, plus the startup surge from the refrigerator and freezer compressors. Motors draw a short burst well above their running watts when they start, so check the surge rating on any system you consider. For capacity, 3,435 Wh plus 20% for inverter losses and a reserve comes to about 4,100 Wh, or 4.1 kWh, for one day.',
      },
      { type: 'h2', id: 'outage-length', text: 'How many days of backup should I plan for?' },
      {
        type: 'p',
        text: 'Multiply your daily figure by the number of days you want to cover without recharging. In the example, two days is about 8.2 kWh. If you add solar charging, each sunny day refills part of the battery, which can cut the storage you need. Our guide to [charging a power station with solar panels](/blog/charge-a-power-station-with-solar-panels) shows how to estimate that.',
      },
      { type: 'h2', id: 'portable-or-whole-home', text: 'Portable power station or whole-home system?' },
      {
        type: 'ul',
        items: [
          'A portable power station suits plans like the example above: 120 V loads you can plug directly into the unit, under a few kilowatt-hours a day.',
          'A whole-home system suits 240 V loads such as well pumps, central air conditioning, and electric ranges, or plans where you want circuits to switch over without running extension cords.',
          'Some portable units can be expanded with extra batteries or connected to a home panel through a transfer switch, which sits between the two options.',
        ],
      },
      {
        type: 'note',
        text: 'Anything connected to your home wiring needs a transfer switch or interlock installed by a licensed electrician. The Consumer Product Safety Commission warns that plugging a generator into a wall outlet, called backfeeding, creates an electrocution risk for utility workers and neighbors.',
      },
    ],
    faqs: [
      {
        question: 'How many kWh do I need to back up a refrigerator?',
        answer:
          'Check the yearly kWh figure on the refrigerator’s EnergyGuide label and divide it by 365. A label showing 600 kWh per year works out to about 1.6 kWh per day. Add around 20% for inverter losses, so plan on roughly 2 kWh of battery for each day of backup.',
      },
      {
        question: 'Is running watts or surge watts more important?',
        answer:
          'Both matter. Running watts must cover everything on at once, and the surge rating must cover the brief startup spike of motors in refrigerators, freezers, pumps, and air conditioners. If the surge rating is too low, the inverter shuts off when a compressor starts even though the running load is well within limits.',
      },
      {
        question: 'Can a battery backup run central air conditioning?',
        answer:
          'Usually only a whole-home system with 240 V output, enough continuous watts for the compressor, and a surge rating that covers its start. Many homes also add a soft-start device to the air conditioner to lower that surge. Confirm the unit’s nameplate figures with your installer before choosing a system.',
      },
    ],
    sources: [doeEstimating, cpscGenerators, ftcEnergyGuide],
  },
  {
    slug: 'portable-power-station-vs-gas-generator',
    title: 'Portable power station vs. gas generator for home backup',
    description:
      'Battery power station or gas generator? See how they differ on indoor safety and runtime, and which one fits your home outage plan.',
    answer:
      'A portable power station is a battery with a built-in inverter. It runs silently and makes no exhaust, so it can be used indoors, but it stops when the battery is empty unless you recharge it. A gas generator runs as long as it has fuel, handles bigger loads for less money, but must stay outdoors because of carbon monoxide.',
    published: '2026-09-25',
    updated: '2026-09-25',
    categories: ['Portable power', 'Whole-home backup'],
    shopLinks: [
      { label: 'Portable power stations', href: '/portable-power' },
      { label: 'Whole-home backup systems', href: '/whole-home-backup' },
    ],
    blocks: [
      { type: 'h2', id: 'main-difference', text: 'What is the main difference?' },
      {
        type: 'p',
        text: 'A generator makes electricity by burning fuel. A power station stores electricity you put into it earlier, from a wall outlet or from solar panels. That single difference drives almost every trade-off below.',
      },
      { type: 'h2', id: 'comparison', text: 'How do they compare side by side?' },
      {
        type: 'table',
        caption: 'Power station and gas generator compared',
        head: ['', 'Portable power station', 'Gas generator'],
        rows: [
          ['Indoor use', 'Yes, no exhaust', 'Never; outdoors only'],
          ['Runtime', 'Limited by battery size; recharge from solar or grid', 'As long as fuel lasts'],
          ['Noise', 'Near silent (cooling fans only)', 'Engine noise'],
          ['Maintenance', 'Little; keep it charged', 'Oil changes, fuel stabilizer, regular test runs'],
          ['Fuel storage', 'None', 'Gasoline or propane stored safely outside the home'],
          ['High-wattage loads', 'Depends on inverter size', 'Often cheaper per watt of output'],
        ],
      },
      { type: 'h2', id: 'safety', text: 'Why does indoor safety matter so much?' },
      {
        type: 'p',
        text: 'Generator exhaust contains carbon monoxide, which you cannot see or smell. The Consumer Product Safety Commission says never to run a generator inside a home, garage, crawlspace, or shed, even with fans running or doors and windows open, because deadly levels of carbon monoxide can build up quickly and linger for hours. It advises placing the generator outdoors, far from doors, windows, and vents, and installing battery-powered carbon monoxide alarms.',
      },
      {
        type: 'p',
        text: 'A power station has no engine and no exhaust, so it can sit next to the refrigerator or a bedside CPAP machine. For apartments and homes without a safe outdoor spot, that often settles the decision.',
      },
      { type: 'h2', id: 'runtime', text: 'Which one lasts longer in a long outage?' },
      {
        type: 'p',
        text: 'With fuel on hand, a generator wins on raw runtime. A power station lasts as long as its stored energy; our guide on [how long a power station runs a refrigerator](/blog/how-long-will-a-power-station-run-a-refrigerator) shows the math. Solar panels change the picture: a station that recharges from panels during the day can keep essential loads going for days as long as the weather cooperates, without buying fuel.',
      },
      { type: 'h2', id: 'who-should-choose', text: 'Which should you choose?' },
      {
        type: 'ul',
        items: [
          'Choose a power station if you need backup indoors, want quiet operation, or mostly run 120 V essentials such as a refrigerator and a CPAP machine.',
          'Choose a generator if you need to run large loads for many days and can store fuel and operate the unit safely outdoors.',
          'Many households use both: a power station for quiet, indoor essentials and a generator outside to recharge it during an extended outage.',
        ],
      },
      {
        type: 'note',
        text: 'Whichever you choose, never power house wiring by plugging into a wall outlet. The CPSC calls this backfeeding and warns that it puts utility workers and neighbors at risk of electrocution. Use a transfer switch or interlock installed by a licensed electrician.',
      },
    ],
    faqs: [
      {
        question: 'Can I use a portable power station indoors?',
        answer:
          'Yes. A battery power station produces no exhaust, so it is designed for indoor use. Keep it on a stable surface with space around the vents and away from water. Follow the manufacturer’s charging instructions. Gas generators are different and must never run indoors or in a garage.',
      },
      {
        question: 'Is a power station quieter than an inverter generator?',
        answer:
          'Yes. A power station has no engine, so the only sound comes from cooling fans that switch on under heavy load or while charging. Even quiet inverter generators have a running engine, which is why power stations are popular for bedrooms and for campgrounds with quiet hours.',
      },
      {
        question: 'Can a gas generator charge a power station?',
        answer:
          'Many power stations accept AC charging from a generator the same way they charge from a wall outlet. Check the power station manual for any generator guidance, and run the generator outdoors, far from windows and doors, while it charges the station.',
      },
    ],
    sources: [cpscGenerators],
  },
  {
    slug: 'how-long-will-a-power-station-run-a-refrigerator',
    title: 'How long will a portable power station run a refrigerator?',
    description:
      'Estimate how many hours a portable power station can run your refrigerator using its EnergyGuide label, with runtimes for 1,152 Wh, 2,000 Wh, and 3,840 Wh units.',
    answer:
      'Divide the power station’s usable watt-hours by the refrigerator’s average watts. Find the average by dividing the yearly kWh on the EnergyGuide label by 8,760 hours. A refrigerator rated 600 kWh per year averages about 68 W, so a 2,000 Wh station runs it for roughly 25 hours.',
    published: '2026-09-25',
    updated: '2026-09-25',
    categories: ['Portable power', 'Refrigerators', 'Freezers'],
    shopLinks: [
      { label: 'Portable power stations', href: '/portable-power' },
      { label: 'Batteries and expansion packs', href: '/batteries' },
    ],
    blocks: [
      { type: 'h2', id: 'formula', text: 'What is the formula?' },
      {
        type: 'p',
        text: 'Runtime in hours = usable capacity in watt-hours ÷ average draw in watts. Two parts of that need a little work: the refrigerator’s average draw, and how much of the power station’s rated capacity you can actually use.',
      },
      { type: 'h2', id: 'average-draw', text: 'How do I find my refrigerator’s average power draw?' },
      {
        type: 'p',
        text: 'Use the yellow EnergyGuide label. The Federal Trade Commission requires refrigerator labels to show estimated yearly electricity use in kilowatt-hours. Divide that number by 8,760, the hours in a year, and multiply by 1,000 to get average watts.',
      },
      {
        type: 'p',
        text: 'For example, a refrigerator labeled 600 kWh per year uses 600,000 Wh ÷ 8,760 h ≈ 68 W on average. The compressor draws much more while it runs, but it cycles off for long stretches, and the average is what drains the battery.',
      },
      {
        type: 'p',
        text: 'No label? The Department of Energy suggests taking the refrigerator’s rated wattage and assuming it runs about one third of the time. A 150 W refrigerator would then average around 50 W.',
      },
      { type: 'h2', id: 'usable-capacity', text: 'How much of the rated capacity can I use?' },
      {
        type: 'p',
        text: 'Some energy is lost converting stored DC battery power to 120 V AC for the refrigerator. We plan with 85% of the rated capacity to leave room for those losses. A 2,000 Wh station gives about 1,700 Wh of usable AC energy on that basis.',
      },
      { type: 'h2', id: 'runtime-table', text: 'How long will common sizes last?' },
      {
        type: 'table',
        caption: 'Estimated runtime for a refrigerator averaging 68 W (600 kWh per year)',
        head: ['Power station capacity', 'Usable at 85%', 'Estimated runtime'],
        rows: [
          ['1,152 Wh (for example, BLUETTI AC180 class)', '979 Wh', 'About 14 hours'],
          ['2,000 Wh', '1,700 Wh', 'About 25 hours'],
          ['3,840 Wh (for example, Anker SOLIX F3800 class)', '3,264 Wh', 'About 48 hours'],
        ],
      },
      { type: 'h2', id: 'real-world', text: 'What makes real runtime shorter or longer?' },
      {
        type: 'ul',
        items: [
          'A hot kitchen and frequent door openings make the compressor run more, shortening runtime.',
          'The EnergyGuide figure is a test-condition estimate, and the FTC notes your own use will differ.',
          'Keeping the doors closed and the refrigerator full helps it hold temperature between compressor cycles.',
          'Solar charging during the day adds energy back; see our guide to [charging a power station with solar panels](/blog/charge-a-power-station-with-solar-panels).',
        ],
      },
      {
        type: 'p',
        text: 'Also check the station’s surge rating. The compressor needs a brief burst of power to start, and a station with enough capacity but too little surge output will trip off every time the compressor kicks on. For whole-day planning across several appliances, use our guide to [sizing a home battery backup](/blog/how-to-size-a-home-battery-backup).',
      },
    ],
    faqs: [
      {
        question: 'Can a 1,000 Wh power station run a refrigerator overnight?',
        answer:
          'Usually yes for an efficient refrigerator. A model averaging 68 W needs about 816 Wh for 12 hours, and a 1,000 Wh station provides roughly 850 Wh after losses. Older or larger refrigerators that use more energy may not make it through the night.',
      },
      {
        question: 'Does a refrigerator need a pure sine wave inverter?',
        answer:
          'Compressor motors run best on pure sine wave power, which is what most current portable power stations produce. Check that the station lists pure sine wave AC output and that its surge rating covers the refrigerator’s startup draw.',
      },
      {
        question: 'Should I run a freezer and refrigerator from the same power station?',
        answer:
          'You can if the station’s continuous output covers both compressors and its surge rating covers one starting while the other runs. Add both appliances’ average watts together to estimate runtime; the combined draw will roughly halve the hours compared with the refrigerator alone.',
      },
    ],
    sources: [ftcEnergyGuide, doeEstimating],
  },
  {
    slug: 'charge-a-power-station-with-solar-panels',
    title: 'How to charge a portable power station with solar panels',
    description:
      'Match solar panels to your power station’s input limits, wire them safely in series or parallel, and estimate how long a full solar recharge will take.',
    answer:
      'Check three numbers on the power station: maximum solar input watts, the input voltage range, and maximum input current. Choose panels whose combined open-circuit voltage stays below the voltage limit, even on cold days, and whose wattage roughly matches the input rating. Expect real output of about 70 to 80% of the panel rating.',
    published: '2026-09-25',
    updated: '2026-09-25',
    categories: ['Solar panels', 'Portable power'],
    shopLinks: [
      { label: 'Solar panels', href: '/solar-panels' },
      { label: 'Portable power stations', href: '/portable-power' },
    ],
    blocks: [
      { type: 'h2', id: 'input-specs', text: 'Which power station specs matter for solar?' },
      {
        type: 'p',
        text: 'Find the solar or DC input section of the spec sheet. You need the maximum input power in watts, the input voltage range (for example, 12 to 60 V), and the maximum input current in amps. The station’s charge controller will not use more than the maximum watts, and voltage above the range can damage it.',
      },
      { type: 'h2', id: 'voltage', text: 'Why does panel voltage matter more than wattage?' },
      {
        type: 'p',
        text: 'A panel’s open-circuit voltage (Voc) is the voltage it produces with nothing connected. Voc rises as temperature falls, so a panel produces more voltage on a cold, bright morning than its label shows. Leave headroom: keep the combined Voc of your panel string comfortably below the station’s maximum input voltage, and check the panel’s temperature coefficient if you charge in freezing weather.',
      },
      { type: 'h2', id: 'series-parallel', text: 'Should I connect panels in series or parallel?' },
      {
        type: 'table',
        caption: 'Series and parallel wiring compared',
        head: ['', 'Series', 'Parallel'],
        rows: [
          ['What adds up', 'Voltage', 'Current (amps)'],
          ['Works well when', 'The station has a wide voltage range', 'The station has a low voltage limit but a higher current limit'],
          ['Shading', 'Shade on one panel lowers the whole string', 'Shade affects each panel more independently'],
          ['Extra parts', 'Usually none beyond cables', 'Branch connectors (for example, MC4 Y-connectors)'],
        ],
      },
      {
        type: 'p',
        text: 'Example: two panels, each with a Voc of 24 V and a rating of 200 W. In series they reach 48 V, which fits a station with a 60 V limit. In parallel they stay at 24 V but double the current, which only works if the station’s current limit allows it.',
      },
      { type: 'h2', id: 'charge-time', text: 'How long does a solar recharge take?' },
      {
        type: 'p',
        text: 'Panels are rated under standard lab conditions, and heat, sun angle, and haze reduce real output. We plan with 75% of the rated wattage during good sun. Charge time ≈ battery capacity ÷ (panel watts × 0.75).',
      },
      {
        type: 'p',
        text: 'Example: a 1,152 Wh station with 400 W of panels gets about 300 W in good sun, so it refills in roughly 3.8 hours of strong sunlight. To estimate how much sun your location gets through the year, NREL’s free PVWatts calculator models solar output by address.',
      },
      { type: 'h2', id: 'setup-tips', text: 'What else helps solar charging?' },
      {
        type: 'ul',
        items: [
          'Point panels at the sun and adjust the angle a few times a day; portable panels have kickstands for this.',
          'Keep panels out of partial shade, since even a shadow across one cell reduces output.',
          'Use the connector or adapter the station manufacturer specifies, and keep cable runs reasonably short.',
          'Keep the power station itself in the shade; batteries charge more slowly when hot.',
        ],
      },
      {
        type: 'p',
        text: 'Pairing solar with storage is what makes a power station useful through longer outages. See [how to size a home battery backup](/blog/how-to-size-a-home-battery-backup) to work out how much capacity to pair with your panels.',
      },
    ],
    faqs: [
      {
        question: 'Can I use a larger solar panel than my power station’s input rating?',
        answer:
          'Extra wattage is generally fine because the station only draws up to its maximum input, and a slightly larger array helps in weak light. Voltage is the hard limit. The panels’ combined open-circuit voltage must stay below the station’s maximum input voltage, including on cold days.',
      },
      {
        question: 'Do I need a separate charge controller?',
        answer:
          'Most portable power stations have a built-in MPPT solar charge controller, so you connect panels directly to the solar input. A separate controller is usually needed only when charging a standalone battery bank that has no built-in controller.',
      },
      {
        question: 'Can I charge a power station with solar on a cloudy day?',
        answer:
          'Yes, but output drops sharply under heavy cloud, often to a small fraction of the panel rating. Plan on longer charge times in winter and in poor weather, and consider adding panel wattage if you rely on solar during outages.',
      },
    ],
    sources: [nrelPvwatts],
  },
  {
    slug: 'lifepo4-vs-nmc-batteries-for-backup-power',
    title: 'LiFePO4 vs. NMC batteries: which chemistry is better for backup power?',
    description:
      'LiFePO4 and NMC lithium batteries differ in cycle life, weight, and heat tolerance. Learn which chemistry fits home backup, portable power, and travel use.',
    answer:
      'For home backup, LiFePO4 (lithium iron phosphate) is usually the better choice. It tolerates heat better and is typically rated for thousands of charge cycles. NMC (nickel manganese cobalt) packs more energy into less weight, which suits units you carry often, but it usually lists fewer rated cycles.',
    published: '2026-09-25',
    updated: '2026-09-25',
    categories: ['Batteries', 'Portable power', 'Whole-home backup'],
    shopLinks: [
      { label: 'Batteries', href: '/batteries' },
      { label: 'Portable power stations', href: '/portable-power' },
      { label: 'Whole-home backup systems', href: '/whole-home-backup' },
    ],
    blocks: [
      { type: 'h2', id: 'what-they-are', text: 'What are LiFePO4 and NMC batteries?' },
      {
        type: 'p',
        text: 'Both are lithium-ion batteries. The name refers to the cathode material. LiFePO4, often shortened to LFP, uses lithium iron phosphate. NMC uses a mix of nickel, manganese, and cobalt. Most home batteries and many current power stations use LFP, while NMC is common in laptops, phones, and older or lighter portable units.',
      },
      { type: 'h2', id: 'comparison', text: 'How do the two chemistries compare?' },
      {
        type: 'table',
        caption: 'LiFePO4 and NMC compared for backup power',
        head: ['', 'LiFePO4 (LFP)', 'NMC'],
        rows: [
          ['Rated cycle life', 'Typically thousands of cycles', 'Typically fewer; check the spec sheet'],
          ['Weight for the same capacity', 'Heavier', 'Lighter'],
          ['Heat tolerance', 'More thermally stable', 'Less tolerant of high temperatures'],
          ['Best fit', 'Home backup, daily solar cycling', 'Frequent carrying, travel'],
        ],
      },
      { type: 'h2', id: 'cycle-life', text: 'What does cycle life mean in practice?' },
      {
        type: 'p',
        text: 'A cycle is one full discharge and recharge. Manufacturers usually rate cycle life as the number of cycles before capacity falls to a set level, often 80% of the original. Many current LFP power stations list 3,000 or more cycles to 80% on their spec sheets. If you cycle a battery daily with solar, that difference adds up over years; if it sits charged for occasional outages, calendar aging matters as much as cycles.',
      },
      {
        type: 'p',
        text: 'When comparing products, look for the cycle count and the capacity percentage it is measured to. A rating of 3,000 cycles to 80% is not the same as 3,000 cycles to 70%.',
      },
      { type: 'h2', id: 'weight', text: 'When does lighter weight matter?' },
      {
        type: 'p',
        text: 'If a unit lives next to your refrigerator or in a utility room, a few extra pounds do not matter. If you carry it to campsites, job sites, or between rooms every week, NMC’s lower weight for the same capacity can be worth the shorter rated life. Check the listed weight alongside capacity before buying.',
      },
      { type: 'h2', id: 'storage-care', text: 'How should I store a backup battery between outages?' },
      {
        type: 'ul',
        items: [
          'Store it in a cool, dry place and avoid hot garages or car trunks in summer.',
          'Follow the manufacturer’s recommended storage charge level and top it up every few months.',
          'Run a short discharge test before storm season so you know it works and what it can power.',
        ],
      },
      {
        type: 'p',
        text: 'Chemistry is one factor; capacity and output still decide whether a battery covers your needs. Use our guide to [sizing a home battery backup](/blog/how-to-size-a-home-battery-backup) to set those numbers first.',
      },
    ],
    faqs: [
      {
        question: 'Is LiFePO4 safer than NMC?',
        answer:
          'LiFePO4 is more thermally stable, meaning it resists overheating better, which is one reason it is widely used in home energy storage. Both chemistries are used safely in certified products with a battery management system. Look for recognized safety certifications on any battery you buy.',
      },
      {
        question: 'How long does a LiFePO4 power station last?',
        answer:
          'It depends on how often you cycle it. A unit rated for 3,000 cycles to 80% capacity and cycled once a day would reach that point after roughly eight years. Used only during occasional outages, it will usually age from time in storage before it reaches its cycle rating.',
      },
      {
        question: 'Can I mix LiFePO4 and NMC batteries?',
        answer:
          'Not within the same battery bank. Different chemistries charge at different voltages and need different settings. Expansion batteries should be the models the power station manufacturer lists as compatible.',
      },
    ],
    sources: [],
  },
];

export const postBySlug = (slug: string) =>
  posts.find((post) => post.slug === slug);

export const postsForCategory = (category: string) =>
  posts.filter((post) => post.categories.includes(category));
