

document.addEventListener("DOMContentLoaded", function(){
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgresscircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    //return true or false base on a regex
    function validateUsername(username){
        if(username.trim() === ""){
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }


    async function fetchUserDetails(username) {

        const url = `https://leetcode-stats-api.herokuapp.com/${username}`


        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the user details");
            }
            const parsedData = await response.json();
            console.log("Logging data: ", parsedData)

            if (!parsedData || parsedData.status === 'error' || parsedData.message === "Something went wrong.") {
                throw new Error("No valid data received");
            }

            displayUserData(parsedData);
        }
        catch(error){
            cardStatsContainer.innerHTML = `
                <p style="color: #ff6b6b; font-size: 1.1rem;">⚠️ No data found for this user.</p>`;
            easyLabel.textContent = '';
            mediumLabel.textContent = '';
            hardLabel.textContent = '';
            easyProgressCircle.style.setProperty("--progress-degree", `0%`);
            mediumProgressCircle.style.setProperty("--progress-degree", `0%`);
            hardProgresscircle.style.setProperty("--progress-degree", `0%`);

        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }


    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData){
        const totalQues = parsedData.totalQuestions;
        const totalEasy = parsedData.totalEasy;
        const totalMedium = parsedData.totalMedium;
        const totalHard = parsedData.totalHard;
        
        const totalSolved = parsedData.totalSolved;
        const easySolved = parsedData.easySolved;
        const mediumSolved = parsedData.mediumSolved;
        const hardSolved = parsedData.hardSolved;
        
        const acceptanceRate = parsedData.acceptanceRate;
        const ranking = parsedData.ranking;
        const contributionPoints = parsedData.contributionPoints;
        const reputation = parsedData.reputation;

        updateProgress(easySolved, totalEasy, easyLabel, easyProgressCircle);
        updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolved, totalHard, hardLabel, hardProgresscircle);


        cardStatsContainer.innerHTML = `
            <p><strong>Total Solved:</strong> ${totalSolved} / ${totalQues}</p>
            <p><strong>Acceptance Rate:</strong> ${acceptanceRate}%</p>
            <p><strong>Ranking:</strong> ${ranking}</p>
            <p><strong>Contribution Points:</strong> ${contributionPoints}</p>
            <p><strong>Reputation:</strong> ${reputation}</p>
        `;
    }


    searchButton.addEventListener('click', function(){
        const username = usernameInput.value;
        console.log("loggin username: ", username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    });

    usernameInput.addEventListener("keyup", function(e){
        if (e.key === "Enter") {
            searchButton.click();
        }
    });
})

