import { Input } from "@/components/ui/input";

interface SearchProps extends React.ComponentPropsWithoutRef<"input"> {}

export function Search(props: SearchProps) {
  return (
    <div {...props}>
      <Input
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
        style={{ background: "hsl(var(--background))" }}
      />
    </div>
  );
}
