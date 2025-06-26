import TextureRenderer from "@/components/tools/texture/TextureRenderer";

export default function RecipeItem(props: { items: string[]; result?: { item: string; count?: number } }) {
    return (
        <div className="flex flex-col gap-2 p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
            <div className="text-sm text-zinc-400">Ingrédients</div>
            <div className="flex flex-wrap gap-2">
                {props.items.filter(item => item.trim()).map((item, index) => (
                    <div key={`${item}-${index}`} className="border border-zinc-700 rounded-lg p-2 bg-zinc-800/50">
                        <TextureRenderer id={item} />
                    </div>
                ))}
            </div>

            {props.result && (
                <div className="mt-4">
                    <div className="text-sm text-zinc-400 mb-2">Résultat</div>
                    <div className="border border-green-700 rounded-lg p-2 bg-green-900/20 inline-block">
                        <TextureRenderer id={props.result.item} />
                        {props.result.count && props.result.count > 1 && (
                            <span className="ml-2 text-xs text-green-400">x{props.result.count}</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
