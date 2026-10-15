# Todo

A todo list for your phone: the chart of the week, your daily tasks, and a lot of confetti when you check them.

**Open it:** https://charles-n1.github.io/Todo/

- Each bar of the chart is a day of this week: one block per task. A checked task = a green block.
- Click a day on the chart to see its tasks (you can still check yesterday's, not tomorrow's).
- **+** adds a task, and the days it repeats. **...** edits or deletes a task.
- ⚙️ (top right): the music, the sounds and the theme.

## On iPhone

1. Open the link in **Safari**.
2. Tap **Share** → **Add to Home Screen**.
3. Open it from the icon: it works like an app, even offline.

Your tasks are saved in the browser of your phone. Clearing Safari's website data erases them.

## Develop

```bash
npm install
npm run dev     # http://localhost:5173/Todo/
npm run build   # the site goes in dist/
```

Every push to `main` publishes the site automatically (GitHub Actions).
