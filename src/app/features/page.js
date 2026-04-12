import Link from "next/link";
import { GlobeIcon, VideoIcon } from "@radix-ui/react-icons";
import {
  Theme,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { FeaturesTopNav } from "@/app/features/FeaturesTopNav";

export const metadata = {
  title: "Features | PhaseMatrixMedia",
  description: "Explore interactive mapping and web conferencing features.",
};

const iconProps = { width: 22, height: 22 };

const FEATURES = [
  {
    href: "/mapping",
    title: "Global Mapping",
    description:
      "Explore the interactive globe experience and spatial visualization work.",
    Icon: GlobeIcon,
  },
  {
    href: "/webconferencing",
    title: "Web Conferencing",
    description:
      "Launch the LiveKit-powered conferencing experience for real-time collaboration.",
    Icon: VideoIcon,
  },
];

export default function FeaturesPage() {
  return (
    <Theme appearance="dark" accentColor="orange" grayColor="slate" radius="large">
      <Box className="min-h-dvh bg-slate-950 text-slate-100">
        <FeaturesTopNav />

        <Container size="4" className="px-4 py-12 sm:px-6 sm:py-16">
          <Flex direction="column" gap="4" className="mb-10 max-w-2xl">
            <Text
              size="2"
              className="!text-[calc(0.75rem+5px)] uppercase tracking-[0.24em] text-orange-300/80"
            >
              Feature Hub
            </Text>
            <Heading size="9" weight="bold">
              Explore the interactive parts of the site.
            </Heading>
          </Flex>

          <Grid columns={{ initial: "1", md: "2" }} gap="6">
            {FEATURES.map(({ href, title, description, Icon }) => (
              <Card
                key={href}
                size="3"
                className="border border-white/10 bg-white/[0.03] p-6 shadow-lg shadow-black/20 transition-transform duration-200 hover:-translate-y-1"
              >
                <Flex direction="column" gap="4" align="start">
                  <Flex
                    align="center"
                    justify="center"
                    className="h-12 w-12 rounded-full bg-orange-500/15 text-orange-300"
                  >
                    <Icon {...iconProps} />
                  </Flex>
                  <Heading size="6">{title}</Heading>
                  <Text size="3" color="gray">
                    {description}
                  </Text>
                  <Button size="3" asChild>
                    <Link href={href}>Open feature</Link>
                  </Button>
                </Flex>
              </Card>
            ))}
          </Grid>
        </Container>
      </Box>
    </Theme>
  );
}
