document.addEventListener("DOMContentLoaded", () => {
    const channelContainer = document.querySelector(".channel-container");
    const paginationDots = document.getElementById("pagination-dots");
    const timeElement = document.getElementById("time");
    const dateElement = document.getElementById("date");

    const channelsPerPage = 9; // 3x3 grid
    let currentPage = 0;
    let channels = [];
    let isScrolling = false;

    // Update Time and Date
    const updateTime = () => {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const date = now.toLocaleDateString();
        timeElement.textContent = time;
        dateElement.textContent = date;
    };
    updateTime();
    setInterval(updateTime, 60000); // Update every minute

    // Fetch channels from the server
    fetch("channels.php")
        .then((response) => response.json())
        .then((data) => {
            channels = data;
            renderPagination();
            renderChannels();
        })
        .catch((error) => console.error("Error fetching channels:", error));

    // Render Pagination Dots
    function renderPagination() {
        const totalPages = Math.ceil(channels.length / channelsPerPage);
        paginationDots.innerHTML = "";

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement("span");
            dot.className = "dot";
            if (i === currentPage) dot.classList.add("active");
            dot.addEventListener("click", () => goToPage(i));
            paginationDots.appendChild(dot);
        }
    }

    // Render Channels for Pages
    function renderChannels() {
        channelContainer.innerHTML = "";
        const totalPages = Math.ceil(channels.length / channelsPerPage);

        for (let page = 0; page < totalPages; page++) {
            const pageGrid = document.createElement("div");
            pageGrid.className = "channel-grid";

            const start = page * channelsPerPage;
            const end = start + channelsPerPage;
            const visibleChannels = channels.slice(start, end);

            visibleChannels.forEach((channel) => {
                const button = document.createElement("button");
                button.className = "channel-button";
                button.innerHTML = `
                    <div class="button-content">
                        <div class="button-text">
                            <span class="name">${channel.name}</span>
                        </div>
                        <div class="button-icon">
                            <img src="${channel.icon}" alt="${channel.name}">
                        </div>
                    </div>
                `;
                button.onclick = () => {
                    window.location.href = `hls-viewer.html?title=${encodeURIComponent(channel.name)}&url=${encodeURIComponent(channel.url)}`;
                };
                pageGrid.appendChild(button);
            });

            channelContainer.appendChild(pageGrid);
        }
    }

    // Navigate to Specific Page
    function goToPage(page) {
        currentPage = page;
        const scrollPosition = page * channelContainer.clientWidth;
        channelContainer.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
        });
        updatePaginationDots();
    }

    // Update Active Pagination Dot
    function updatePaginationDots() {
        const dots = paginationDots.querySelectorAll(".dot");
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentPage);
        });
    }

    // Handle Scroll for Snap Effect
    channelContainer.addEventListener("scroll", () => {
        if (!isScrolling) {
            isScrolling = true;

            setTimeout(() => {
                const newPage = Math.round(
                    channelContainer.scrollLeft / channelContainer.clientWidth
                );

                // Only update if the page has changed
                if (newPage !== currentPage) {
                    currentPage = newPage;
                    updatePaginationDots();
                }
                isScrolling = false;
            }, 100);
        }
    });

    // Add Touch End Behavior for Snapping
    channelContainer.addEventListener("touchend", () => {
        const snapPosition = currentPage * channelContainer.clientWidth;
        channelContainer.scrollTo({
            left: snapPosition,
            behavior: "smooth",
        });
    });

    // Add Mouse Up Behavior for Snapping (optional for desktop users)
    channelContainer.addEventListener("mouseup", () => {
        const snapPosition = currentPage * channelContainer.clientWidth;
        channelContainer.scrollTo({
            left: snapPosition,
            behavior: "smooth",
        });
    });
});
