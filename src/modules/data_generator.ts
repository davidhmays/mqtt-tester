export const generate_user = () => {
    var a = [
        "Impatient",
        "Blue",
        "Ugly",
        "Friendly",
        "Sunny",
        "Quick",
        "Intelligent",
        "Curious",
        "Elegant",
        "Delightful",
        "Playful",
        "Vibrant",
        "Clever",
        "Lively",
        "Cozy",
        "Radiant",
        "Sparkling",
        "Adventurous",
        "Mysterious",
        "Peaceful",
    ];
    var b = [
        "Banana",
        "Penguin",
        "Rock",
        "Pickle",
        "Noodle",
        "Giraffe",
        "Squirrel",
        "Sock",
        "Llama",
        "Wombat",
        "Pancake",
        "Unicorn",
        "Pajamas",
        "Bear",
        "Taco",
        "Tire",
        "Lobster",
        "Pineapple",
        "Kangaroo",
        "Beluga",
    ];
    var rA = Math.floor(Math.random() * a.length);
    var rB = Math.floor(Math.random() * b.length);
    return a[rA] + b[rB];
};
export const generate_id = (a) => (a ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generate_id));
