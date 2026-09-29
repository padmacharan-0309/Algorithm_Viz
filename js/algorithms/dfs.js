/* ==========================================================================
   ALGO VIZ - Depth-First Search (DFS) Implementation
   ========================================================================== */

export function generateDFSSteps(graph, { startNodeId = 'A', targetNodeId = null } = {}) {
  const steps = [];
  const nodes = graph.nodes;
  const edges = graph.edges;

  // Build adjacency list
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => {
    adj[e.from].push({ neighbor: e.to, weight: e.weight });
    adj[e.to].push({ neighbor: e.from, weight: e.weight });
  });

  const visited = new Set();
  const stack = [];
  const parent = {};
  const traversedEdges = [];
  let edgesChecked = 0;
  let targetFound = false;

  function dfsVisit(u) {
    if (targetFound) return;

    visited.add(u);
    stack.push(u);

    steps.push({
      currentNode: u,
      visitedNodes: Array.from(visited),
      stack: [...stack],
      activeEdges: [],
      traversedEdges: [...traversedEdges],
      codeLine: 1,
      description: `Visiting node [${u}]. Pushed to call stack: [${stack.join(' → ')}]`,
      stats: {
        visitedCount: visited.size,
        edgesChecked,
        currentNode: u,
        step: steps.length
      }
    });

    if (targetNodeId && u === targetNodeId) {
      targetFound = true;
      return;
    }

    const neighbors = adj[u] || [];
    for (const { neighbor } of neighbors) {
      if (targetFound) break;
      edgesChecked++;

      steps.push({
        currentNode: u,
        visitedNodes: Array.from(visited),
        stack: [...stack],
        activeEdges: [{ from: u, to: neighbor }],
        traversedEdges: [...traversedEdges],
        codeLine: 3,
        description: `Inspecting branch from [${u}] to neighbor [${neighbor}]`,
        stats: {
          visitedCount: visited.size,
          edgesChecked,
          currentNode: u,
          step: steps.length
        }
      });

      if (!visited.has(neighbor)) {
        parent[neighbor] = u;
        traversedEdges.push({ from: u, to: neighbor });
        dfsVisit(neighbor);
      }
    }

    stack.pop();
    steps.push({
      currentNode: u,
      visitedNodes: Array.from(visited),
      stack: [...stack],
      activeEdges: [],
      traversedEdges: [...traversedEdges],
      codeLine: 5,
      description: `Backtracking from [${u}]. Remaining stack: [${stack.length ? stack.join(' → ') : 'Empty'}]`,
      stats: {
        visitedCount: visited.size,
        edgesChecked,
        currentNode: stack[stack.length - 1] || 'None',
        step: steps.length
      }
    });
  }

  dfsVisit(startNodeId);

  // Shortest / Traversal path
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
    stack: [],
    activeEdges: [],
    traversedEdges: [...traversedEdges],
    shortestPathEdges,
    codeLine: 5,
    description: `DFS complete! Visited ${visited.size} nodes and inspected ${edgesChecked} edges.`,
    stats: {
      visitedCount: visited.size,
      edgesChecked,
      currentNode: 'Done',
      step: steps.length
    }
  });

  return steps;
}
