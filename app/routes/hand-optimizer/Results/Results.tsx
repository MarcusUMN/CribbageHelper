import { ParsedUrlQuery } from "querystring";
import {
  Tabs,
  Center,
  Loader,
  Button,
  Group,
  Title,
  Badge,
} from "@mantine/core";
import {
  IconTableFilled,
  IconCirclePercentageFilled,
} from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { FormatCard } from "../../../ui/FormatCard";
import { Stats } from "./Stats";
import { Probabilities } from "./Probabilities";
import classes from "./Results.module.css";
import { useCachedEvaluation } from "../hooks/useCachedEvaluation";

type Props = {
  queryParams: ParsedUrlQuery;
};

export const Results = ({ queryParams }: Props) => {
  const navigate = useNavigate();
  const handKey = queryParams.data as string | undefined;
  const cribFlag = queryParams.crib as string | undefined;
  const isMyCrib = cribFlag === "Y";

  if (!handKey) return <div>No hand data provided</div>;

  const { result, loading } = useCachedEvaluation(handKey, isMyCrib);

  if (loading || !result) {
    return (
      <Center mt="xl" style={{ height: "700px" }}>
        <Loader color="blue" size="lg" />
      </Center>
    );
  }

  return (
    <div className={classes.wrapper}>
      <Group justify="space-between" align="center" mb="sm">
        <Group>
          <Title order={3}>RESULTS</Title>
          <Badge
            color={isMyCrib ? "green" : "gray"}
            variant="light"
            size="lg"
            mt={4}
          >
            {isMyCrib ? "Your Crib" : "Opponent's Crib"}
          </Badge>
        </Group>
        <Button onClick={() => navigate("/hand-optimizer")}>New hand</Button>
      </Group>
      <Group gap="xs" mb="md">
        {handKey.split("-").map((cardStr, idx) => {
          const rank = cardStr.slice(0, -1);
          const suit = cardStr.slice(-1) as "S" | "H" | "D" | "C";
          return <FormatCard key={idx} rank={rank} suit={suit} iconSize={20} />;
        })}
      </Group>
      <Tabs variant="pills" defaultValue="stats">
        <Tabs.List>
          <Tabs.Tab value="stats" leftSection={<IconTableFilled size={12} />}>
            Stats
          </Tabs.Tab>
          <Tabs.Tab
            value="probabilities"
            leftSection={<IconCirclePercentageFilled size={12} />}
          >
            Probabilities
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="stats">
          <Stats hands={result} isMyCrib={isMyCrib} />
        </Tabs.Panel>
        <Tabs.Panel value="probabilities">
          <Probabilities hands={result} isMyCrib={isMyCrib} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
