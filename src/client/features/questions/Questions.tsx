import { Button, Flex, Heading, Text } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientUrl } from "~/client/utils/clientUrl";
import type { TarotDrawHistoryApi } from "~/server/routes";

const query = hc<TarotDrawHistoryApi>(clientUrl);

export const Questions = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    query.api["tarot-draw-histories"].$get().then((result) => {
      result.json().then((body) => {
        if ("data" in body) {
          setQuestions(body.data);
        }
      });
    });
  }, []);

  return (
    <Flex direction="column" gap="3">
      <Heading>占い履歴</Heading>
      {questions.reverse().map((question) => (
        <Button
          key={question.id}
          onClick={() => {
            nav(`/questions/${question.id}/fortune-telling`);
          }}
        >
          <Text>{question.question}</Text>
        </Button>
      ))}
    </Flex>
  );
};
