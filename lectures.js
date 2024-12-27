document.addEventListener("DOMContentLoaded", () => {
    const lectures = {
        "Lec5_6": "data/Lec5_6.json",
        "Lec7_8": "data/Lec7_8.json", 
        "Lec9_10_11": "data/Lec9_10_11.json",
    };

    const lectureList = document.getElementById("lectures");

    for (let lecture in lectures) {
        const li = document.createElement("li");
        li.textContent = lecture;
        li.addEventListener("click", () => {
            localStorage.setItem("selectedLecture", lecture);
            window.location.href = "index.html";
        });
        lectureList.appendChild(li);
    }
});