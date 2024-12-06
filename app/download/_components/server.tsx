export default async function Server() {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/ditto")
    const data = await res.json()
    // console.log(data)

    console.log("server rendered")
    return (
        <p>This is server component</p>
    )
}
