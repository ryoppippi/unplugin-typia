import UnpluginTypia from 'unplugin-typia/bun'

await Bun.build({
	entrypoints: ["./index.ts"],
	outdir: "./out",
	plugins: [
    UnpluginTypia()
	]
});
