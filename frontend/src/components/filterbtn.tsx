import {useRouter} from "next/navigation";

export const FilterButton = ({tag}: {tag: string}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${tag}`);
  };

  return (
    <button
      className="text-[16px] font-medium text-[---text]"
      onClick={handleClick}
    >
      <span className="text-[16px] font-medium text-[---text]">
        View All {tag.charAt(0).toUpperCase() + tag.slice(1)} Products
      </span>
    </button>
  );
};
