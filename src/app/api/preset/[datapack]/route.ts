import { type NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { datapack: string } }) {
    try {
        const version = params.datapack;
        if (!version || !/^\d+$/.test(version)) {
            return NextResponse.json({ error: "Version invalide" }, { status: 400 });
        }

        const fileName = `enchantment-${version}.zip`;
        const githubUrl = `https://raw.githubusercontent.com/Hardel-DW/voxel-datapack-preset/main/${fileName}`;

        const response = await fetch(githubUrl);
        if (!response.ok) {
            return NextResponse.json({ error: "Datapack non trouvé" }, { status: 404 });
        }

        // Récupération du contenu binaire
        const zipContent = await response.arrayBuffer();

        // Retourne le fichier ZIP
        return new NextResponse(zipContent, {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Cache-Control": "public, max-age=31536000"
            }
        });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
