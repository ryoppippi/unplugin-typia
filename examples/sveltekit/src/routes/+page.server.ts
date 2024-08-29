import { codeToHtml } from 'shiki'

export const load = async ()=>{
  const tsInterface = await codeToHtml(
    `
interface IMember {
  id: string & tags.Format<"uuid">;
  email: string & tags.Format<"email">;
  age: number & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
}
`.trim(),
    {
      lang: 'typescript',
      theme: 'vitesse-dark'
    }
  );

  return { tsInterface }
}
