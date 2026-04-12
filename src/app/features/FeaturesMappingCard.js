"use client";

import { GlobeIcon } from "@radix-ui/react-icons";
import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useGlobalMapping } from "@/app/Components/Mapping/GlobalMappingProvider";

const iconProps = { width: 22, height: 22 };

export function FeaturesMappingCard() {
  const { openGlobalMapping } = useGlobalMapping();

  return (
    <Card
      size="3"
      className="border border-white/10 bg-white/[0.03] p-6 shadow-lg shadow-black/20 transition-transform duration-200 hover:-translate-y-1"
    >
      <Flex direction="column" gap="4" align="start">
        <Flex
          align="center"
          justify="center"
          className="h-12 w-12 rounded-full bg-orange-500/15 text-orange-300"
        >
          <GlobeIcon {...iconProps} />
        </Flex>
        <Heading size="6">Global Mapping</Heading>
        <Text size="3" color="gray">
          Explore the interactive globe experience and spatial visualization work.
        </Text>
        <Button size="3" type="button" onClick={() => openGlobalMapping()}>
          Open feature
        </Button>
      </Flex>
    </Card>
  );
}
