interface IData {
  name: string;
  description: string;
}

export default async function Page() {
  const data = await fetch(`https://api.github.com/repos/tanstack/react-query`);
  const res: IData = await data.json();
  console.log(res);
  return (
    <div>
      <h1>{res.name}</h1>
      <p>{res.description}</p>
    </div>
  );
}
