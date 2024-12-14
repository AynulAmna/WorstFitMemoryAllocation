document.getElementById('allocateBtn').addEventListener('click', function() {
    const memoryBlocksInput = document.getElementById('memory-blocks').value;
    const processesInput = document.getElementById('processes').value;

    const memoryBlocks = memoryBlocksInput.split(',').map(block => parseInt(block.trim()));
    const processes = processesInput.split(',').map(process => parseInt(process.trim()));

    const allocations = worstFit(memoryBlocks, processes);
    displayResults(allocations);
});

function worstFit(memoryBlocks, processes) {
    // Sort memory blocks in descending order
    const blocks = [...memoryBlocks].sort((a, b) => b - a);
    const allocations = [];
    const remainingMemory = [...memoryBlocks];

    processes.forEach(processSize => {
        let maxRemainingBlock = -1;
        let blockIndex = -1;

        // Find the worst fit block
        for (let i = 0; i < remainingMemory.length; i++) {
            if (remainingMemory[i] >= processSize && remainingMemory[i] > maxRemainingBlock) {
                maxRemainingBlock = remainingMemory[i];
                blockIndex = i;
            }
        }

        if (blockIndex !== -1) {
            // Allocate the process to the worst fit block
            remainingMemory[blockIndex] -= processSize;
            allocations.push({
                processSize,
                blockAllocated: blockIndex + 1,
                remainingBlocks: [...remainingMemory] // Store remaining memory of each block
            });
        } else {
            allocations.push({
                processSize,
                blockAllocated: 'None',
                remainingBlocks: [...remainingMemory]
            });
        }
    });

    return allocations;
}

function displayResults(allocations) {
    const resultBody = document.getElementById('resultBody');
    resultBody.innerHTML = ''; // Clear previous results

    allocations.forEach((allocation, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${allocation.processSize}</td>
            <td>${allocation.blockAllocated}</td>
            <td>
                <button onclick="toggleDetails(${index})">Show Remaining Memory</button>
                <div id="details${index}" class="details">
                    <ul>
                        ${allocation.remainingBlocks.map((memory, i) => `<li>Block ${i + 1}: ${memory}</li>`).join('')}
                    </ul>
                </div>
            </td>
        `;
        resultBody.appendChild(row);
    });
}

function toggleDetails(index) {
    const detailsDiv = document.getElementById(`details${index}`);
    detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';
}
