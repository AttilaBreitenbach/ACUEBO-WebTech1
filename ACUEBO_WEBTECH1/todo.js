    let tasks = [];

    const el = (id) => document.getElementById(id);
    const listEl = el("list");
    const emptyEl = el("empty");

    const taskTitle = el("taskTitle");
    const team = el("team");
    const session = el("session");
    const priority = el("priority");
    const addBtn = el("addBtn");

    const q = el("q");
    const fStatus = el("fStatus");
    const fTeam = el("fTeam");
    const clearDoneBtn = el("clearDoneBtn");

    const stAll = el("stAll");
    const stDone = el("stDone");
    const stLeft = el("stLeft");

    function uid(){
      return (crypto?.randomUUID?.() ?? String(Date.now()) + Math.random().toString(16).slice(2));
    }

    function matchesFilters(t){
      const needle = q.value.trim().toLowerCase();
      if(needle){
        const hay = `${t.title} ${t.team} ${t.session} ${t.priority}`.toLowerCase();
        if(!hay.includes(needle)) return false;
      }

      if(fStatus.value === "open" && t.done) return false;
      if(fStatus.value === "done" && !t.done) return false;

      if(fTeam.value !== "all" && t.team !== fTeam.value) return false;

      return true;
    }

    function updateStats(){
      const all = tasks.length;
      const done = tasks.filter(t => t.done).length;
      stAll.textContent = String(all);
      stDone.textContent = String(done);
      stLeft.textContent = String(all - done);
    }

    function render(){
      updateStats();

      const visible = tasks.filter(matchesFilters);
      listEl.innerHTML = "";
      emptyEl.style.display = visible.length ? "none" : "block";

      visible.forEach((t) => {
        const row = document.createElement("div");
        row.className = "item" + (t.done ? " done" : "");
        row.draggable = true;
        row.dataset.id = t.id;

        row.addEventListener("dragstart", () => row.classList.add("dragging"));
        row.addEventListener("dragend", () => row.classList.remove("dragging"));

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "check";
        cb.checked = t.done;
        cb.addEventListener("change", () => {
          t.done = cb.checked;
          render();
        });

        const mid = document.createElement("div");

        const name = document.createElement("div");
        name.className = "name";

        const titleSpan = document.createElement("span");
        titleSpan.className = "text";
        titleSpan.textContent = t.title || "(nincs cím)";
        name.appendChild(titleSpan);

        const meta = document.createElement("div");
        meta.className = "meta";

        if(t.session) meta.appendChild(tag(t.session));
        if(t.team) meta.appendChild(tag("🏎️ " + t.team));

        const pTag = tag("⚑ " + t.priority.toUpperCase());
        pTag.classList.add("prio-" + t.priority);
        meta.appendChild(pTag);

        mid.appendChild(name);
        mid.appendChild(meta);

        const actions = document.createElement("div");
        actions.className = "actions";

        const delBtn = document.createElement("button");
        delBtn.className = "iconbtn";
        delBtn.textContent = "🗑️";
        delBtn.title = "Törlés";
        delBtn.addEventListener("click", () => {
          tasks = tasks.filter(x => x.id !== t.id);
          render();
        });

        actions.appendChild(delBtn);

        row.appendChild(cb);
        row.appendChild(mid);
        row.appendChild(actions);

        listEl.appendChild(row);
      });
    }

    function tag(text){
      const s = document.createElement("span");
      s.className = "tag";
      s.textContent = text;
      return s;
    }

    function addTask(){
      const title = taskTitle.value.trim();
      if(!title){
        taskTitle.focus();
        taskTitle.style.borderColor = "rgba(255,45,45,.6)";
        setTimeout(() => taskTitle.style.borderColor = "transparent", 700);
        return;
      }

      const t = {
        id: uid(),
        title,
        team: team.value.trim(),
        session: session.value,
        priority: priority.value,
        done: false,
        createdAt: Date.now()
      };

      tasks.unshift(t);

      taskTitle.value = "";
      team.value = "";
      session.value = "FP1";
      priority.value = "medium";

      render();
      taskTitle.focus();
    }

    addBtn.addEventListener("click", addTask);
    taskTitle.addEventListener("keydown", (e) => { if(e.key === "Enter") addTask(); });

    [q, fStatus, fTeam].forEach(ctrl => {
      ctrl.addEventListener("input", render);
      ctrl.addEventListener("change", render);
    });

    clearDoneBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => !t.done);
      render();
    });

    // Drag & Drop rendezés
    listEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      const dragging = listEl.querySelector(".dragging");
      if(!dragging) return;

      const after = getDragAfterElement(listEl, e.clientY);
      if(after == null){
        listEl.appendChild(dragging);
      } else {
        listEl.insertBefore(dragging, after);
      }
    });

    listEl.addEventListener("drop", () => {
      const domIds = Array.from(listEl.querySelectorAll(".item")).map(x => x.dataset.id);

      const visibleSet = new Set(domIds);
      const visibleTasks = domIds.map(id => tasks.find(t => t.id === id)).filter(Boolean);
      const hiddenTasks = tasks.filter(t => !visibleSet.has(t.id));

      tasks = [...visibleTasks, ...hiddenTasks];
      render();
    });

    function getDragAfterElement(container, y){
      const els = [...container.querySelectorAll(".item:not(.dragging)")];
      let closest = { offset: Number.NEGATIVE_INFINITY, element: null };
      for(const child of els){
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if(offset < 0 && offset > closest.offset){
          closest = { offset, element: child };
        }
      }
      return closest.element;
    }

    render();