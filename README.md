# 📦 Archiving unplugin-typia

After two years of development and community support, I'm archiving this repository effective immediately.

## 🎯 **TL;DR**
This plugin will no longer be maintained. Feel free to fork if you need continued support.

## 🔍 **Background**

`unplugin-typia` was created to make [Typia](https://typia.io) integration easier across different bundlers like Vite, esbuild, Webpack, and others. It has served its purpose well, but several factors have led to this decision:

**Technical considerations**: TypeScript's ongoing migration to [tsgo (TypeScript Native Port)](https://devblogs.microsoft.com/typescript/typescript-native-port/) introduces significant architectural changes. The new Go-based compiler uses IPC-based APIs rather than direct access to compiler internals, creating uncertainty around transformation tools like Typia and ts-patch that rely heavily on TypeScript's internal APIs.

**Personal transition**: My focus has shifted to other projects and directions.

## 🏆 **Adoption & Impact**

I'm incredibly proud that this plugin found its way into many notable projects:

- **[Hugging Face Inference Playground](https://github.com/huggingface/inference-playground)** - Interactive ML model playground
- **[Wrtn Labs Agentica](https://github.com/wrtnlabs/agentica)** - AI agent framework
- **[Wrtn Labs AutoView](https://github.com/wrtnlabs/autoview)** - Automated view generation
- **[Typia Rspack Plugin](https://github.com/colinaaa/typia-rspack-plugin)** - Rspack integration inspired by this work
- **[Hono Middleware](https://github.com/honojs/middleware)** - Web framework middleware collection
- **[Lynx Stack](https://github.com/lynx-family/lynx-stack)** - Full-stack development framework
- **[Arri](https://github.com/modiimedia/arri)** - Type-safe RPC framework

The plugin has consistently maintained **22K+ weekly downloads** on npm, demonstrating real community value and adoption.

## 🧪 **Technical Status**

The current codebase should continue working as long as:
- Typia maintains its current `tsc` + `ts-patch` based transformation approach
- Your bundler versions remain compatible
- TypeScript versions stay within the supported range

You may need to update peer dependencies over time, but the core transformation mechanism should remain stable until TypeScript's architectural changes take effect.

## 🔄 **Alternatives**

Currently, there's no direct replacement. If you need continued support:
- **Fork this repository** - You're welcome to maintain your own version
- **Consider Typia's built-in integrations** - Check the [official Typia setup docs](https://typia.io/docs/setup/) for bundler-specific guidance
- **Explore generation mode** - Typia offers code generation approaches that may be less dependent on transformation APIs

## 🙏 **Acknowledgments**

This journey wouldn't have been possible without incredible support:

**@samchon** was my first sponsor and provided the opportunity to contribute significantly to Typia's development. My research and optimization work helped improve Typia's performance and led to detailed technical blog posts that resonated strongly with the community.

**@timoxley** became a sponsor after seeing this project's impact, providing additional encouragement for open-source work.

The broader TypeScript and bundling community embraced this tool, and seeing it used in production at companies and significant open-source projects has been incredibly rewarding.

Working on this project deepened my understanding of build systems, tree-shaking, TypeScript transformations, and compiler optimization techniques. The technical challenges and solutions developed here have been invaluable for my growth as a developer.

## 🚀 **Looking Forward**

While I'm stepping away from this specific project, I wish the Typia community continued success. The innovations in TypeScript runtime validation and serialization that Typia pioneered have pushed the entire ecosystem forward.

Thank you to everyone who used, contributed to, or supported this project. Your feedback and adoption made this journey meaningful.

---

*Repository archived on June 14, 2025*
