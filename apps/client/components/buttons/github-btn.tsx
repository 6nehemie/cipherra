import GitHub from '@/components/icons/logos/github';

const GitHubBtn = () => {
  return (
    <button className="flex items-center justify-center gap-4 h-[50px] px-6 border-[1.5px] border-custom-gray-2 rounded-xl w-full bg-custom-gray-3 hover:bg-custom-gray-2 hover:text-white transition-colors duration-200">
      <GitHub className="size-7 fill-custom-gray-1" />
      <div className="font-medium">Continue with Github</div>
    </button>
  );
};
export default GitHubBtn;
