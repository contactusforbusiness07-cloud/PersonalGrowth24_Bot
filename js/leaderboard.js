// Ensure Firebase Firestore is initialized correctly somewhere as 'db'
// const db = firebase.firestore(); 

const LB_CACHE_KEY = 'fingamepro_lb_data';
const LB_TIME_KEY = 'fingamepro_lb_time';
const CACHE_DURATION_MS = 20 * 60 * 1000; // 20 Minutes Cache (Adjust as needed)

// --- Helper: Format Numbers like "92k" ---
function formatK(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toLocaleString();
}


// --- Main Function to Call When Opening Leaderboard Tab ---
async function openLeaderboard() {
    // 1. Show the section (assuming you have tab logic)
    // document.getElementById('home-section').classList.add('hidden');
    // document.getElementById('leaderboard-section').classList.remove('hidden');

    const listContainer = document.getElementById('lb-list-render');
    const now = Date.now();
    const cachedTime = localStorage.getItem(LB_TIME_KEY);
    let leaderboardData = [];

    // 2. Check Cache Strategy (Crucial for 20k users)
    if (cachedTime && (now - parseInt(cachedTime) < CACHE_DURATION_MS)) {
        console.log("Using Cached Leaderboard Data ⚡");
        leaderboardData = JSON.parse(localStorage.getItem(LB_CACHE_KEY));
        renderHitechLeaderboard(leaderboardData);
    } else {
        console.log("Fetching Fresh Leaderboard Data from Firebase 🔥");
        listContainer.innerHTML = '<p style="text-align:center; color: #888; padding-top: 20px;">Updating live ranks...</p>';
        
        try {
            // REAL LOGIC: Fetch top 100 sorted by balance
            const snapshot = await db.collection('users')
                .orderBy('balance', 'desc')
                .limit(100)
                .get();

            leaderboardData = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                leaderboardData.push({
                    id: doc.id,
                    // Use firstName or a default username placeholder
                    name: data.firstName ? data.firstName : `User_${doc.id.substring(0,4)}`,
                    // Use placeholder image if user doesn't have one
                    avatar: data.photoURL || 'assets/default_avatar.png', 
                    balance: data.balance || 0
                });
            });

            // Save to cache
            localStorage.setItem(LB_CACHE_KEY, JSON.stringify(leaderboardData));
            localStorage.setItem(LB_TIME_KEY, now.toString());

            renderHitechLeaderboard(leaderboardData);

        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            listContainer.innerHTML = '<p style="color:red; text-align:center;">Failed to load ranks.</p>';
        }
    }
}


// --- Renderer Function (Updates UI) ---
function renderHitechLeaderboard(data) {
    const listContainer = document.getElementById('lb-list-render');
    listContainer.innerHTML = ''; // Clear loading state

    // We need at least 3 users for the podium to look right
    if (data.length < 3) {
        listContainer.innerHTML = "<p>Not enough players yet!</p>";
        return;
    }

    // --- 1. Update Top 3 Podium (The Kings) ---
    // Rank 1 (Array index 0)
    document.getElementById('p1-name').innerText = data[0].name;
    document.getElementById('p1-score').innerText = formatK(data[0].balance);
    // document.getElementById('p1-img').src = data[0].avatar; // Uncomment if you have avatars

    // Rank 2 (Array index 1)
    document.getElementById('p2-name').innerText = data[1].name;
    document.getElementById('p2-score').innerText = formatK(data[1].balance);
    // document.getElementById('p2-img').src = data[1].avatar;

    // Rank 3 (Array index 2)
    document.getElementById('p3-name').innerText = data[2].name;
    document.getElementById('p3-score').innerText = formatK(data[2].balance);
    // document.getElementById('p3-img').src = data[2].avatar;


    // --- 2. Render the List (Ranks 4 to 100) ---
    // Start loop from index 3 (which is Rank 4)
    for (let i = 3; i < data.length; i++) {
        const user = data[i];
        const rank = i + 1;

        const card = document.createElement('div');
        card.className = 'lb-card';
        // Add slight animation delay for hitech feel
        card.style.animation = `fadeInUp 0.5s ease backwards ${i * 0.05}s`;

        card.innerHTML = `
            <span class="lb-rank">#${rank}</span>
            <img src="${user.avatar}" class="lb-avatar" alt="user">
            <span class="lb-username">${user.name}</span>
            <span class="lb-coins">${user.balance.toLocaleString()}</span>
        `;
        listContainer.appendChild(card);
    }
}

// Add this small animation to CSS if you want the list to load smoothly
// @keyframes fadeInUp { from { opacity:0; transform: translateY(20px);} to { opacity:1; transform: translateY(0);} }
