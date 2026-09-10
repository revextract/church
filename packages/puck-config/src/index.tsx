import type { Config, Data } from "@puckeditor/core";
import { Hero, type HeroProps } from "./components/hero";

export { Hero };
export type { HeroProps };

/// Every component the visual editor can place, keyed by the name that gets
/// written into `Page.puckJson`. Renaming a key orphans existing content.
export type PuckComponents = {
  Hero: HeroProps;
};

export const config: Config<PuckComponents> = {
  components: {
    Hero: {
      label: "Hero",
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "textarea", label: "Subtitle" },
      },
      defaultProps: {
        title: "Welcome to our church",
        subtitle: "Join us this Sunday at 9:00 and 11:00 AM.",
      },
      render: ({ title, subtitle }) => <Hero title={title} subtitle={subtitle} />,
    },
  },
};

/// A page layout typed against this config's component set.
export type PuckData = Data<PuckComponents>;

/// Shape Puck expects for a page that has never been edited.
export const emptyData: PuckData = {
  root: { props: {} },
  content: [],
  zones: {},
};

/// `Page.puckJson` is `Json` as far as Prisma is concerned, so narrow it here
/// rather than sprinkling casts through the apps.
export function toPuckData(value: unknown): PuckData {
  if (value && typeof value === "object" && Array.isArray((value as PuckData).content)) {
    return value as PuckData;
  }
  return emptyData;
}

export default config;
