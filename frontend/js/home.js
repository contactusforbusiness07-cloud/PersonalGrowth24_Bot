// --- HOME SECTION LOGIC ---

function openToolModal(toolType) {
    const modal = document.getElementById('tool-modal');
    const title = document.getElementById('tool-modal-title');
    const body = document.getElementById('tool-modal-body');
    
    // Unlock Logic check (Simulation for now)
    // Future: Check Firebase if user has unlocked the tool
    
    let contentHTML = '';
    
    if (toolType === 'cv') {
        title.innerText = 'CV Builder 🔒';
        contentHTML = `
            <div style="text-align: center;">
                <p class="mb-4 text-gray-400">Unlock this Premium Tool to generate AI Resumes.</p>
                <div class="glass-card mb-3 p-3" style="border: 1px solid var(--gold);">
                    <h4 style="color: var(--gold);">Requirement</h4>
                    <p>Invite 2 Friends or Watch an Ad</p>
                </div>
                <button class="btn-primary" onclick="alert('Ad Integration coming soon!')">Watch Ad (30s)</button>
                <button class="btn-primary mt-2" style="background: transparent; border: 1px solid #fff;" onclick="openInternalPage('refer')">Invite Friends</button>
            </div>
        `;
    } else if (toolType === 'love') {
        title.innerText = 'Love Calculator ❤️';
        contentHTML = `
            <div style="text-align: center;">
                <input type="text" placeholder="Your Name" class="w-full p-2 rounded bg-slate-800 border mb-2 text-white">
                <input type="text" placeholder="Partner Name" class="w-full p-2 rounded bg-slate-800 border mb-4 text-white">
                <button class="btn-primary" onclick="alert('Calculating Love... 99%!')">Calculate</button>
            </div>
        `;
    } 
    // Add other tools logic here...

    body.innerHTML = contentHTML;
    modal.classList.remove('hidden');
}

function closeToolModal() {
    document.getElementById('tool-modal').classList.add('hidden');
}
