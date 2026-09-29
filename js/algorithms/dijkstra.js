/* ==========================================================================
   ALGO VIZ - Dijkstra's Algorithm Implementation
   Includes distance relaxation table and shortest path reconstruction
   ========================================================================== */

export function generateDijkstraSteps(graph, { startNodeId = 'A', targetNodeId = 'F' } = {}) {
  const steps = [];
  const nodes = graph.nodes;
  const edges = graph.edges;

  // Build adjacency list with weights
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => {
    adj[e.from].push({ neighbor: e.to, weight: e.weight });
    adj[e.to].push({ neighbor: e.from, weight: e.weight });
  });

  const distances = {};
  const parent = {};
  const unvisited = new Set();
  const visited = new Set();
  let edgesChecked = 0;

  nodes.forEach(n => {
    distances[n.id] = Infinity;
    unvisited.add(n.id);
  });
  distances[startNodeId] = 0;

  steps.push({
    currentNode: startNodeId,
    visitedNodes: [],
    distances: { ...distances },
    parent: { ...parent },
    activeEdges: [],
    relaxedEdges: [],
    codeLine: 0,
    description: `Initialized tentative distances. Start node [${startNodeId}] = 0, all others = ∞`,
    stats: {
      visitedCount: 0,
      edgesChecked: 0,
      currentDistance: 0,
      currentNode: startNodeId,
      step: 0
    }
  });

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let minNode = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        minNode = nodeId;
      }
    }

    if (minNode === null || minDistance === Infinity) {
      // Remaining unvisited nodes are unreachable
      break;
    }

    const u = minNode;
    unvisited.delete(u);
    visited.add(u);

    steps.push({
      currentNode: u,
      visitedNodes: Array.from(visited),
      distances: { ...distances },
      parent: { ...parent },
      activeEdges: [],
      relaxedEdges: [],
      codeLine: 2,
      description: `Selected unvisited node [${u}] with minimum distance (${minDistance}). Marking as settled.`,
      stats: {
        visitedCount: visited.size,
        edgesChecked,
        currentDistance: minDistance,
        currentNode: u,
        step: steps.length
      }
    });

    if (targetNodeId && u === targetNodeId) {
      break;
    }

    const neighbors = adj[u] || [];
    for (const { neighbor, weight } of neighbors) {
      if (!unvisited.has(neighbor)) continue;
      edgesChecked++;

      const alt = distances[u] + weight;

      steps.push({
        currentNode: u,
        visitedNodes: Array.from(visited),
        distances: { ...distances },
        parent: { ...parent },
        activeEdges: [{ from: u, to: neighbor }],
        relaxedEdges: [],
        codeLine: 4,
        description: `Checking edge (${u} — ${neighbor}, weight ${weight}): Current dist = ${distances[neighbor]}, Alt = ${distances[u]} + ${weight} = ${alt}`,
        stats: {
          visitedCount: visited.size,
          edgesChecked,
          currentDistance: distances[u],
          currentNode: u,
          step: steps.length
        }
      });

      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        parent[neighbor] = u;

        steps.push({
          currentNode: u,
          visitedNodes: Array.from(visited),
          distances: { ...distances },
          parent: { ...parent },
          activeEdges: [{ from: u, to: neighbor }],
          relaxedEdges: [{ from: u, to: neighbor }],
          codeLine: 6,
          description: `Relaxed edge! Shorter path found to [${neighbor}]: updated distance to ${alt}`,
          stats: {
            visitedCount: visited.size,
            edgesChecked,
            currentDistance: alt,
            currentNode: u,
            step: steps.length
          }
        });
      }
    }
  }

  // Reconstruct shortest path to target
  const shortestPathEdges = [];
  if (targetNodeId && distances[targetNodeId] !== Infinity) {
    let curr = targetNodeId;
    while (parent[curr]) {
      shortestPathEdges.push({ from: parent[curr], to: curr });
      curr = parent[curr];
    }
  }

  const finalDist = targetNodeId ? distances[targetNodeId] : distances[startNodeId];

  steps.push({
    currentNode: null,
    visitedNodes: Array.from(visited),
    distances: { ...distances },
    parent: { ...parent },
    activeEdges: [],
    relaxedEdges: [],
    shortestPathEdges,
    codeLine: 6,
    description: `Dijkstra completed! Shortest path to [${targetNodeId || 'all'}] is ${finalDist === Infinity ? 'Unreachable' : finalDist}.`,
    stats: {
      visitedCount: visited.size,
      edgesChecked,
      currentDistance: finalDist === Infinity ? '∞' : finalDist,
      currentNode: 'Settled',
      step: steps.length
    }
  });

  return steps;
}
