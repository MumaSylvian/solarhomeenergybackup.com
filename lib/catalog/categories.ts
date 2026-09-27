/**
 * The storefront's categories: one source for the header and phone menus,
 * the footer, the homepage, breadcrumbs, and the category pages at
 * /{slug} (app/[category]). Menu order is browse order.
 */
export type CategoryGroup = 'Backup power' | 'Home appliances';

const categoryData = [
  {
    label: 'Whole-home backup',
    slug: 'whole-home-backup',
    group: 'Backup power',
    metaTitle: 'Whole-Home Backup Power Systems',
    metaDescription:
      'Compare whole-home backup systems: inverters, battery banks, and power kits sized for essential circuits or full-home coverage during outages.',
    eyebrow: 'Whole-home backup',
    title: 'Reserve power for the home you live in.',
    copy: 'Explore capable systems for essential circuits, expanded home coverage, and a more deliberate path to resilient energy.',
    planning: 'Start with critical loads—not a generic package.',
    useCases: [
      'List the circuits that must stay on during an outage, then estimate their combined running watts.',
      'Choose the backup duration that works for your household and size battery capacity around that target.',
      'Confirm compatible transfer equipment, voltage, and a qualified installation plan before purchase.',
    ],
  },

  {
    label: 'Portable power',
    slug: 'portable-power',
    group: 'Backup power',
    metaTitle: 'Portable Power Stations',
    metaDescription:
      'Portable power stations from EcoFlow, Anker SOLIX, BLUETTI, and more for outages, RVs, job sites, and camping. Compare capacity and output.',
    eyebrow: 'Portable power',
    title: 'Reliable energy that moves with you.',
    copy: 'Find portable stations for outage readiness, travel, remote work, and everyday power where an outlet is not an option.',
    planning: 'Match the station to the devices you actually use.',
    useCases: [
      'Add the running watts of the equipment you expect to power at the same time.',
      'Use battery capacity to estimate your desired runtime, allowing room for real-world losses.',
      'Check the required plugs, charging inputs, and weight before choosing a portable setup.',
    ],
  },
  {
    label: 'Batteries',
    slug: 'batteries',
    group: 'Backup power',
    metaTitle: 'Home Batteries & Expansion Batteries',
    metaDescription:
      'LiFePO4 home batteries, rack batteries, and expansion packs for power stations and hybrid inverters. Compare capacity and voltage.',
    eyebrow: 'Batteries',
    title: 'Storage that sets how long backup lasts.',
    copy: 'Home batteries, server-rack packs, and expansion batteries that add capacity to power stations and hybrid systems.',
    planning: 'Capacity decides runtime; compatibility decides everything else.',
    useCases: [
      'Estimate the energy you use during an outage (watt-hours), then add headroom for inverter losses.',
      'Confirm the battery voltage and communication protocol match your inverter or power station.',
      'Check the expansion limits of your system before adding packs.',
    ],
  },
  {
    label: 'Solar panels',
    slug: 'solar-panels',
    group: 'Backup power',
    metaTitle: 'Solar Panels for Home & Portable Power',
    metaDescription:
      'Solar panels and charging equipment for portable power stations, home battery storage, and fixed rooftop or ground-mount solar systems.',
    eyebrow: 'Solar charging',
    title: 'Turn daylight into stored power.',
    copy: 'Browse solar panels and charging equipment for portable power stations, battery storage, and fixed solar systems.',
    planning: 'Choose panels around site conditions, compatibility, and your charging goal.',
    useCases: [
      'Confirm the selected panel and power station or charge controller are electrically compatible.',
      'Plan for real-world sunlight, available mounting space, cable length, and shading.',
      'Use manufacturer documentation and qualified installation help for fixed home installations.',
    ],
  },

  {
    label: 'Home integration',
    slug: 'home-integration',
    group: 'Backup power',
    metaTitle: 'Transfer Switches, Smart Panels & Home Integration',
    metaDescription:
      'Transfer switches, smart home panels, inlet boxes, and load controllers for connecting backup power to your home safely.',
    eyebrow: 'Home integration',
    title: 'Connect backup power to your home safely.',
    copy: 'Transfer switches, smart panels, inlets, and controllers that route backup power to the circuits you choose.',
    planning: 'Integration equipment must match your panel and your power source.',
    useCases: [
      'Identify your main panel type and the circuits you want backed up.',
      'Match the switch or panel to your generator, power station, or inverter output.',
      'Have installation done by a licensed electrician, following local code.',
    ],
  },
  {
    label: 'EV chargers',
    slug: 'ev-chargers',
    group: 'Backup power',
    metaTitle: 'Home EV Chargers (Level 2)',
    metaDescription:
      'Level 2 home EV chargers and compatible home-energy equipment, with guidance on circuits, installation, and pairing with solar and batteries.',
    eyebrow: 'EV charging',
    title: 'Charge at home with a clearer energy plan.',
    copy: 'Browse Level 2 chargers and compatible home-energy equipment from the current catalog.',
    planning: 'Plan the circuit, connector, and location before you choose.',
    useCases: [
      'Confirm the vehicle connector and charger compatibility.',
      'Review the charging circuit and installation requirements with a qualified installer.',
      'Match the charger to your home-energy equipment and daily driving needs.',
    ],
  },

  {
    label: 'Accessories',
    slug: 'accessories',
    group: 'Backup power',
    metaTitle: 'Solar & Backup Power Accessories',
    metaDescription:
      'Cables, connectors, mounts, covers, and system accessories for solar and backup power setups.',
    eyebrow: 'Accessories',
    title: 'The parts that complete a system.',
    copy: 'Cables, connectors, mounting hardware, covers, and add-ons for solar and backup power equipment.',
    planning: 'Match every accessory to the exact model it connects to.',
    useCases: [
      'Check connector types and cable gauge against the current the cable will carry.',
      'Confirm model compatibility for covers, mounts, and expansion accessories.',
      'Measure cable runs before ordering so lengths fit your layout.',
    ],
  },
  {
    label: 'Refrigerators',
    slug: 'refrigerators',
    group: 'Home appliances',
    metaTitle: 'Refrigerators',
    metaDescription:
      'French-door, side-by-side, top- and bottom-freezer, and compact refrigerators from leading brands, with flat $45 US delivery.',
    eyebrow: 'Refrigerators',
    title: 'Refrigerators for every kitchen.',
    copy: 'French-door, side-by-side, top- and bottom-freezer, and compact refrigerators from recognized brands.',
    planning: 'Measure the space, then choose the style.',
    useCases: [
      'Measure width, height, and depth, plus door-swing clearance and the path through your home.',
      'Choose counter-depth or standard-depth to match your cabinets.',
      'Check the running watts if you plan to keep it on backup power during outages.',
    ],
  },
  {
    label: 'Freezers',
    slug: 'freezers',
    group: 'Home appliances',
    metaTitle: 'Chest & Upright Freezers',
    metaDescription: 'Chest, upright, and portable freezers for dependable cold storage, with flat $45 US delivery.',
    eyebrow: 'Freezers',
    title: 'Cold storage you can count on.',
    copy: 'Chest, upright, and portable freezers for garages, kitchens, and backup food storage.',
    planning: 'Pick the format that fits how you store food.',
    useCases: [
      'Chest freezers hold temperature longer during outages; uprights are easier to organize.',
      'Check whether the model is rated for garage temperatures if it will live there.',
      'Note the running watts to plan backup power for it.',
    ],
  },
  {
    label: 'Dishwashers',
    slug: 'dishwashers',
    group: 'Home appliances',
    metaTitle: 'Dishwashers',
    metaDescription:
      'Built-in, panel-ready, portable, and compact dishwashers from leading brands, with flat $45 US delivery.',
    eyebrow: 'Dishwashers',
    title: 'Dishwashers for everyday kitchens.',
    copy: 'Built-in, panel-ready, portable, and compact dishwashers, compared by noise level and features.',
    planning: 'Fit and noise level come first.',
    useCases: [
      'Measure the opening: most built-ins are 24 in. wide; compact models are 18 in.',
      'Compare noise ratings (dBA) if your kitchen is open-plan.',
      'Check the water and electrical connections your installer will need.',
    ],
  },
  {
    label: 'Washers & Dryers',
    slug: 'washers-dryers',
    group: 'Home appliances',
    metaTitle: 'Washers & Dryers',
    metaDescription:
      'Top-load and front-load washers, electric and gas dryers, and laundry centers, with flat $45 US delivery.',
    eyebrow: 'Washers & dryers',
    title: 'Laundry equipment for every home.',
    copy: 'Top-load and front-load washers, dryers, stacked laundry centers, and commercial units.',
    planning: 'Confirm your hookups before you choose.',
    useCases: [
      'Check whether your dryer hookup is electric (240V) or gas.',
      'Measure the space, including room for venting and door clearance.',
      'Consider a stacked laundry center where floor space is tight.',
    ],
  },
] as const satisfies readonly {
  label: string;
  slug: string;
  group: CategoryGroup;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  copy: string;
  planning: string;
  useCases: readonly string[];
}[];

export const storefrontCategories = categoryData.map((category) => ({ ...category, href: `/${category.slug}` }));
export type StorefrontCategory = (typeof storefrontCategories)[number];

export const categoryByLabel = (label: string) => storefrontCategories.find((category) => category.label === label);
export const categoryBySlug = (slug: string) => storefrontCategories.find((category) => category.slug === slug);

export const categoryGroups: { group: CategoryGroup; categories: StorefrontCategory[] }[] = (
  ['Backup power', 'Home appliances'] as const
).map((group) => ({ group, categories: storefrontCategories.filter((category) => category.group === group) }));

/** Products per category page. */
export const CATEGORY_PAGE_SIZE = 48;
