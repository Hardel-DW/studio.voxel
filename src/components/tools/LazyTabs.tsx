import dynamic from "next/dynamic";
import Loader from "../ui/Loader";

export default function LazyTabs(componentName: string) {
    const componentMap: Record<string, () => Promise<any>> = {
        "enchant.main": () => import("./section/enchantment/Main"),
        "enchant.find": () => import("./section/enchantment/Find"),
        "enchant.slot": () => import("./section/enchantment/Slot"),
        "enchant.item": () => import("./section/enchantment/Item"),
        "enchant.exclusive": () => import("./section/enchantment/Exclusive"),
        "enchant.technical": () => import("./section/enchantment/Technical")
    };

    return componentMap[componentName]
        ? dynamic(componentMap[componentName], {
              loading: () => <Loader />,
              ssr: false
          })
        : dynamic(() => Promise.resolve({ default: () => <Loader /> }), {
              loading: () => <Loader />,
              ssr: false
          });
}
