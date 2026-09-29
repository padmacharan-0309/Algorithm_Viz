/* ==========================================================================
   ALGO VIZ - Breadth-First Search (BFS) Implementation
   ========================================================================== */

export function generateBFSSteps(graph, { startNodeId = 'A', targetNodeId = null } = {}) {
  const steps = [];
  const nodes = graph.nodes;
  const edges = graph.edges;

  // Build adjacency list
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => {
    adj[e.from].push({ neighbor: e.to, weight: e.weight });
    adj[e.to].push({ neighbor: e.from, weight: e.weight }); // Undirected
  });

  const visited = new Set();
  const queue = [startNodeId];
  const parent = {};
  const traversedEdges = [];
  let edgesChecked = 0;

  visited.add(startNodeId);

  steps.push({
    currentNode: startNodeId,
    visitedNodes: Array.from(visited),
    queue: [...queue],
    activeEdges: [],
    traversedEdges: [],
    codeLine: 0,
    description: `Enqueued start node [${startNodeId}] and marked as visited.`,
    stats: {
      visitedCount: visited.size,
      edgesChecked,
      currentNode: startNodeId,
      step: 0
    }
  });

  let targetFound = false;

  while (queue.length > 0) {
    const current = queue.shift();

    steps.push({
      currentNode: current,
      visitedNodes: Array.from(visited),
      queue: [...queue],
      activeEdges: [],
      traversedEdges: [...traversedEdges],
      codeLine: 2,
      description: `Dequeued node [${current}]. Exploring its unvisited neighbors.`,
      stats: {
        visitedCount: visited.size,
        edgesChecked,
        currentNode: current,
        step: steps.length
      }
    });

    if (targetNodeId && current === targetNodeId) {
      targetFound = true;
      break;
    }

    const neighbors = adj[current] || [];
    for (const { neighbor } of neighbors) {
      edgesChecked++;

      steps.push({
        currentNode: current,
        visitedNodes: Array.from(visited),
        queue: [...queue],
        activeEdges: [{ from: current, to: neighbor }],
        traversedEdges: [...traversedEdges],
        codeLine: 4,
        description: `Inspecting edge (${current} — ${neighbor})`,
        stats: {
          visitedCount: visited.size,
          edgesChecked,
          currentNode: current,
          step: steps.length
        }
      });

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent[neighbor] = current;
        traversedEdges.push({ from: current, to: neighbor });
        queue.push(neighbor);

        steps.push({
          currentNode: current,
          visitedNodes: Array.from(visited),
          queue: [...queue],
          activeEdges: [{ from: current, to: neighbor }],
          traversedEdges: [...traversedEdges],
          codeLine: 6,
          description: `Discovered unvisited neighbor [${neighbor}]. Enqueued and marked visited.`,
          stats: {
            visitedCount: visited.size,
            edgesChecked,
            currentNode: current,
            step: steps.length
          }
        });
      }
    }
  }

  // Reconstruct path if target was provided
  const shortestPathEdges = [];
  if (targetNodeId && visited.has(targetNodeId)) {
    let curr = targetNodeId;
    while (parent[curr]) {
      shortestPathEdges.push({ from: parent[curr], to: curr });
      curr = parent[curr];
    }
  }

  steps.push({
    currentNode: null,
    visitedNodes: Array.from(visited),
    queue: [],
    activeEdges: [],
    traversedEdges: [...traversedEdges],
    shortestPathEdges,
    codeLine: 1,
    description: `BFS complete! Visited ${visited.size} nodes and checked ${edgesChecked} edges.`,
    stats: {
      visitedCount: visited.size,
      edgesChecked,
      currentNode: 'None',
      step: steps.length
    }
  });

  return steps;
}
