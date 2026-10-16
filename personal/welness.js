
document.addEventListener("DOMContentLoaded", function () {

  // =========================
  // 1. GET HTML ELEMENTS
  // =========================

  const moodButtons = document.querySelectorAll(".mood-option");
  const saveMoodButton = document.getElementById("save-mood");
  const moodFeedback = document.getElementById("mood-feedback");
  const lowMoodAlert = document.getElementById("low-mood-alert");
  const moodNote = document.getElementById("mood-note");

  const taskCheckboxes = document.querySelectorAll(
    ".daily-task input[type='checkbox']"
  );

  const progressText = document.getElementById("task-progress-text");
  const progressFill = document.getElementById("task-progress-fill");
  const progressBar = document.getElementById("task-progress-bar");

  const breathingButton = document.getElementById("breathing-button");
  const breathingCircle = document.getElementById("breathing-circle");
  const breathingText = document.getElementById("breathing-text");

  const toast = document.getElementById("wellness-toast");

  // =========================
  // 2. VARIABLES
  // =========================

  let selectedMood = "";
  let lowMoodCount = 0;
  let toastTimer;
  let breathingTimer;
  let breathingRunning = false;

  const moodMessages = {
    great: "Glad you're feeling good today. Keep doing what supports you!",
    okay: "It's okay to have an ordinary day. Take it one step at a time.",
    low: "Thank you for checking in. Be gentle with yourself today.",
    anxious: "Take a slow breath. You don't need to solve everything at once."
  };

  // =========================
  // 3. SHOW MESSAGE
  // =========================

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 3000);
  }

  // =========================
  // 4. SELECT MOOD
  // =========================

  moodButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      selectedMood = button.dataset.mood;

      moodButtons.forEach(function (item) {
        const isSelected = item === button;

        item.classList.toggle("selected", isSelected);
        item.setAttribute("aria-pressed", String(isSelected));
      });

      if (moodFeedback) {
        moodFeedback.style.color = "";
        moodFeedback.textContent =
          "Mood selected. Press Save mood to confirm your check-in.";
      }

    });

  });

  // =========================
  // 5. SAVE MOOD
  // =========================

  if (saveMoodButton) {

    saveMoodButton.addEventListener("click", function () {

      // Make sure the user selected a mood.
      if (!selectedMood) {

        if (moodFeedback) {
          moodFeedback.style.color = "#a33c3c";
          moodFeedback.textContent =
            "Please choose a mood before saving.";
        }

        return;
      }

      // Display a message for the selected mood.
      if (moodFeedback) {
        moodFeedback.style.color = "#27856c";
        moodFeedback.textContent = moodMessages[selectedMood];
      }

      // Count confirmed Low mood check-ins.
      if (selectedMood === "low") {

        lowMoodCount++;

        // Show alert on the sixth Low mood check-in.
        if (lowMoodCount > 5 && lowMoodAlert) {
          lowMoodAlert.hidden = false;
        }

      }

      // Clear the note after the check-in.
      // No browser storage is used.
      if (moodNote) {
        moodNote.value = "";
      }

      showToast("Your mood check-in is complete.");

    });

  }

  // =========================
  // 6. DAILY TASKS
  // =========================

  function updateTaskProgress() {

    const total = taskCheckboxes.length;

    const completed = Array.from(taskCheckboxes).filter(
      function (checkbox) {
        return checkbox.checked;
      }
    ).length;

    const percentage = total === 0
      ? 0
      : Math.round((completed / total) * 100);

    // Update completed task count.
    if (progressText) {
      progressText.textContent =
        completed + " of " + total + " completed";
    }

    // Update progress bar width.
    if (progressFill) {
      progressFill.style.width = percentage + "%";
    }

    // Update accessibility information.
    if (progressBar) {
      progressBar.setAttribute(
        "aria-valuenow",
        String(percentage)
      );
    }

    // Update completed task appearance.
    taskCheckboxes.forEach(function (checkbox) {

      const task = checkbox.closest(".daily-task");

      if (task) {
        task.classList.toggle("completed", checkbox.checked);
      }

    });

  }

  taskCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", updateTaskProgress);
  });

  // Display initial progress.
  updateTaskProgress();

  // =========================
  // 7. BREATHING EXERCISE
  // =========================

  function setBreathingPhase(phase, label, duration) {

    if (!breathingCircle || !breathingText) return;

    breathingCircle.classList.remove(
      "inhale",
      "hold",
      "exhale"
    );

    breathingCircle.classList.add(phase);
    breathingCircle.textContent = label;
    breathingText.textContent = label;

    clearTimeout(breathingTimer);

    if (duration) {
      breathingTimer = setTimeout(
        runNextBreathingPhase,
        duration
      );
    }

  }

  function runNextBreathingPhase() {

    if (!breathingRunning) return;

    const phase = breathingCircle.dataset.phase;

    if (phase === "inhale") {

      breathingCircle.dataset.phase = "hold";

      setBreathingPhase("hold", "Hold", 2000);

    } else if (phase === "hold") {

      breathingCircle.dataset.phase = "exhale";

      setBreathingPhase("exhale", "Breathe out", 6000);

    } else {

      breathingCircle.dataset.phase = "inhale";

      setBreathingPhase("inhale", "Breathe in", 4000);

    }

  }

  function stopBreathing() {

    breathingRunning = false;

    clearTimeout(breathingTimer);

    if (breathingCircle) {

      breathingCircle.classList.remove(
        "inhale",
        "hold",
        "exhale"
      );

      breathingCircle.textContent = "Breathe";
      breathingCircle.dataset.phase = "inhale";

    }

    if (breathingText) {
      breathingText.textContent =
        "Breathe gently at your own pace. Stop whenever you need to.";
    }

    if (breathingButton) {
      breathingButton.textContent = "Start breathing";
    }

  }

  if (breathingButton && breathingCircle && breathingText) {

    breathingCircle.dataset.phase = "inhale";

    breathingButton.addEventListener("click", function () {

      // Stop the exercise if it is already running.
      if (breathingRunning) {
        stopBreathing();
        return;
      }

      // Start the exercise.
      breathingRunning = true;

      breathingButton.textContent = "Stop exercise";
      breathingCircle.dataset.phase = "inhale";

      setBreathingPhase(
        "inhale",
        "Breathe in",
        4000
      );

    });

  }

});
