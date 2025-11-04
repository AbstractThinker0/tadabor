import { Button, Flex, Text, NativeSelect } from "@chakra-ui/react";

// Reusable paginator component
const Paginator = ({
  total,
  limit,
  offset,
  onChange,
}: {
  total: number;
  limit: number;
  offset: number;
  onChange: (p: { limit: number; offset: number }) => void;
}) => {
  const page = limit ? Math.floor(offset / limit) + 1 : 1;
  const pages = limit ? Math.max(1, Math.ceil((total || 0) / limit)) : 1;
  const canPrev = offset > 0;
  const canNext = offset + limit < (total || 0);
  const sizes = [10, 20, 50, 100];

  return (
    <Flex align="center" gap={3} wrap="wrap" justify="space-between">
      <Flex align="center" gap={2} wrap="wrap">
        <Button
          size="sm"
          onClick={() =>
            onChange({ limit, offset: Math.max(0, offset - limit) })
          }
          disabled={!canPrev}
        >
          Prev
        </Button>
        <Button
          size="sm"
          onClick={() =>
            onChange({ limit, offset: canNext ? offset + limit : offset })
          }
          disabled={!canNext}
        >
          Next
        </Button>
        <Text color="fg.muted">
          Page {page} / {pages} • Total {total ?? 0}
        </Text>
      </Flex>
      <Flex align="center" gap={2}>
        <Text>Page size</Text>
        <NativeSelect.Root bgColor={"bg"}>
          <NativeSelect.Field
            value={String(limit)}
            onChange={(ev) =>
              onChange({ limit: Number(ev.target.value), offset: 0 })
            }
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Flex>
    </Flex>
  );
};

export { Paginator };
