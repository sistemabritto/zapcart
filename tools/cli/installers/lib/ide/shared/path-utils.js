/**
 * Path transformation utilities for IDE installer standardization
 *
 * Provides utilities to convert hierarchical paths to flat naming conventions.
 *
 * DASH-BASED NAMING (new standard):
 * - Agents: evo-agent-module-name.md (with evo-agent- prefix)
 * - Workflows/Tasks/Tools: evo-module-name.md
 *
 * Example outputs:
 * - cis/agents/storymaster.md → evo-agent-cis-storymaster.md
 * - bmm/workflows/plan-project.md → evo-bmm-plan-project.md
 * - bmm/tasks/create-story.md → evo-bmm-create-story.md
 * - core/agents/brainstorming.md → evo-agent-brainstorming.md (core agents skip module name)
 * - standalone/agents/fred.md → evo-agent-standalone-fred.md
 */

// Type segments - agents are included in naming, others are filtered out
const TYPE_SEGMENTS = ['workflows', 'tasks', 'tools'];
const AGENT_SEGMENT = 'agents';

// EVO installation folder name - centralized constant for all installers
const EVO_FOLDER_NAME = '_evo';

/**
 * Convert hierarchical path to flat dash-separated name (NEW STANDARD)
 * Converts: 'bmm', 'agents', 'pm' → 'evo-agent-bmm-pm.md'
 * Converts: 'bmm', 'workflows', 'correct-course' → 'evo-bmm-correct-course.md'
 * Converts: 'core', 'agents', 'brainstorming' → 'evo-agent-brainstorming.md' (core agents skip module name)
 * Converts: 'standalone', 'agents', 'fred' → 'evo-agent-standalone-fred.md'
 *
 * @param {string} module - Module name (e.g., 'bmm', 'core', 'standalone')
 * @param {string} type - Artifact type ('agents', 'workflows', 'tasks', 'tools')
 * @param {string} name - Artifact name (e.g., 'pm', 'brainstorming')
 * @returns {string} Flat filename like 'evo-agent-bmm-pm.md' or 'evo-bmm-correct-course.md'
 */
function toDashName(module, type, name) {
  const isAgent = type === AGENT_SEGMENT;

  // For core module, skip the module name: use 'evo-agent-name.md' instead of 'evo-agent-core-name.md'
  if (module === 'core') {
    return isAgent ? `evo-agent-${name}.md` : `evo-${name}.md`;
  }
  // For standalone module, include 'standalone' in the name
  if (module === 'standalone') {
    return isAgent ? `evo-agent-standalone-${name}.md` : `evo-standalone-${name}.md`;
  }

  // Module artifacts: evo-module-name.md or evo-agent-module-name.md
  // eslint-disable-next-line unicorn/prefer-string-replace-all -- regex replace is intentional here
  const dashName = name.replace(/\//g, '-'); // Flatten nested paths
  return isAgent ? `evo-agent-${module}-${dashName}.md` : `evo-${module}-${dashName}.md`;
}

/**
 * Convert relative path to flat dash-separated name
 * Converts: 'bmm/agents/pm.md' → 'evo-agent-bmm-pm.md'
 * Converts: 'bmm/agents/tech-writer/tech-writer.md' → 'evo-agent-bmm-tech-writer.md' (uses folder name)
 * Converts: 'bmm/workflows/correct-course.md' → 'evo-bmm-correct-course.md'
 * Converts: 'core/agents/brainstorming.md' → 'evo-agent-brainstorming.md' (core agents skip module name)
 *
 * @param {string} relativePath - Path like 'bmm/agents/pm.md'
 * @returns {string} Flat filename like 'evo-agent-bmm-pm.md' or 'evo-brainstorming.md'
 */
function toDashPath(relativePath) {
  if (!relativePath || typeof relativePath !== 'string') {
    // Return a safe default for invalid input
    return 'evo-unknown.md';
  }

  // Strip common file extensions to avoid double extensions in generated filenames
  // e.g., 'create-story.xml' → 'create-story', 'workflow.md' → 'workflow'
  const withoutExt = relativePath.replace(/\.(md|yaml|yml|json|xml|toml)$/i, '');
  const parts = withoutExt.split(/[/\\]/);

  const module = parts[0];
  const type = parts[1];
  let name;

  // For agents, if nested in a folder (more than 3 parts), use the folder name only
  // e.g., 'bmm/agents/tech-writer/tech-writer' → 'tech-writer' (not 'tech-writer-tech-writer')
  if (type === 'agents' && parts.length > 3) {
    // Use the folder name (parts[2]) as the name, ignore the file name
    name = parts[2];
  } else {
    // For non-nested or non-agents, join all parts after type
    name = parts.slice(2).join('-');
  }

  return toDashName(module, type, name);
}

/**
 * Create custom agent dash name
 * Creates: 'evo-custom-agent-fred-commit-poet.md'
 *
 * @param {string} agentName - Custom agent name
 * @returns {string} Flat filename like 'evo-custom-agent-fred-commit-poet.md'
 */
function customAgentDashName(agentName) {
  return `evo-custom-agent-${agentName}.md`;
}

/**
 * Check if a filename uses dash format
 * @param {string} filename - Filename to check
 * @returns {boolean} True if filename uses dash format
 */
function isDashFormat(filename) {
  return filename.startsWith('evo-') && filename.includes('-');
}

/**
 * Extract parts from a dash-formatted filename
 * Parses: 'evo-agent-bmm-pm.md' → { prefix: 'evo', module: 'bmm', type: 'agents', name: 'pm' }
 * Parses: 'evo-bmm-correct-course.md' → { prefix: 'evo', module: 'bmm', type: 'workflows', name: 'correct-course' }
 * Parses: 'evo-agent-brainstorming.md' → { prefix: 'evo', module: 'core', type: 'agents', name: 'brainstorming' } (core agents)
 * Parses: 'evo-brainstorming.md' → { prefix: 'evo', module: 'core', type: 'workflows', name: 'brainstorming' } (core workflows)
 * Parses: 'evo-agent-standalone-fred.md' → { prefix: 'evo', module: 'standalone', type: 'agents', name: 'fred' }
 * Parses: 'evo-standalone-foo.md' → { prefix: 'evo', module: 'standalone', type: 'workflows', name: 'foo' }
 *
 * @param {string} filename - Dash-formatted filename
 * @returns {Object|null} Parsed parts or null if invalid format
 */
function parseDashName(filename) {
  const withoutExt = filename.replace('.md', '');
  const parts = withoutExt.split('-');

  if (parts.length < 2 || parts[0] !== 'evo') {
    return null;
  }

  // Check if this is an agent file (has 'agent' as second part)
  const isAgent = parts[1] === 'agent';

  if (isAgent) {
    // This is an agent file
    // Format: evo-agent-name (core) or evo-agent-standalone-name or evo-agent-module-name
    if (parts.length >= 4 && parts[2] === 'standalone') {
      // Standalone agent: evo-agent-standalone-name
      return {
        prefix: parts[0],
        module: 'standalone',
        type: 'agents',
        name: parts.slice(3).join('-'),
      };
    }
    if (parts.length === 3) {
      // Core agent: evo-agent-name
      return {
        prefix: parts[0],
        module: 'core',
        type: 'agents',
        name: parts[2],
      };
    } else {
      // Module agent: evo-agent-module-name
      return {
        prefix: parts[0],
        module: parts[2],
        type: 'agents',
        name: parts.slice(3).join('-'),
      };
    }
  }

  // Not an agent file - must be a workflow/tool/task
  // If only 2 parts (evo-name), it's a core workflow/tool/task
  if (parts.length === 2) {
    return {
      prefix: parts[0],
      module: 'core',
      type: 'workflows', // Default to workflows for non-agent core items
      name: parts[1],
    };
  }

  // Check for standalone non-agent: evo-standalone-name
  if (parts[1] === 'standalone') {
    return {
      prefix: parts[0],
      module: 'standalone',
      type: 'workflows', // Default to workflows for non-agent standalone items
      name: parts.slice(2).join('-'),
    };
  }

  // Otherwise, it's a module workflow/tool/task (evo-module-name)
  return {
    prefix: parts[0],
    module: parts[1],
    type: 'workflows', // Default to workflows for non-agent module items
    name: parts.slice(2).join('-'),
  };
}

// ============================================================================
// LEGACY FUNCTIONS (underscore format) - kept for backward compatibility
// ============================================================================

/**
 * Convert hierarchical path to flat underscore-separated name (LEGACY)
 * @deprecated Use toDashName instead
 */
function toUnderscoreName(module, type, name) {
  const isAgent = type === AGENT_SEGMENT;
  if (module === 'core') {
    return isAgent ? `evo_agent_${name}.md` : `evo_${name}.md`;
  }
  if (module === 'standalone') {
    return isAgent ? `evo_agent_standalone_${name}.md` : `evo_standalone_${name}.md`;
  }
  return isAgent ? `evo_${module}_agent_${name}.md` : `evo_${module}_${name}.md`;
}

/**
 * Convert relative path to flat underscore-separated name (LEGACY)
 * @deprecated Use toDashPath instead
 */
function toUnderscorePath(relativePath) {
  // Strip common file extensions (same as toDashPath for consistency)
  const withoutExt = relativePath.replace(/\.(md|yaml|yml|json|xml|toml)$/i, '');
  const parts = withoutExt.split(/[/\\]/);

  const module = parts[0];
  const type = parts[1];
  const name = parts.slice(2).join('_');

  return toUnderscoreName(module, type, name);
}

/**
 * Create custom agent underscore name (LEGACY)
 * @deprecated Use customAgentDashName instead
 */
function customAgentUnderscoreName(agentName) {
  return `evo_custom_${agentName}.md`;
}

/**
 * Check if a filename uses underscore format (LEGACY)
 * @deprecated Use isDashFormat instead
 */
function isUnderscoreFormat(filename) {
  return filename.startsWith('evo_') && filename.includes('_');
}

/**
 * Extract parts from an underscore-formatted filename (LEGACY)
 * @deprecated Use parseDashName instead
 */
function parseUnderscoreName(filename) {
  const withoutExt = filename.replace('.md', '');
  const parts = withoutExt.split('_');

  if (parts.length < 2 || parts[0] !== 'evo') {
    return null;
  }

  const agentIndex = parts.indexOf('agent');

  if (agentIndex !== -1) {
    if (agentIndex === 1) {
      // evo_agent_... - check for standalone
      if (parts.length >= 4 && parts[2] === 'standalone') {
        return {
          prefix: parts[0],
          module: 'standalone',
          type: 'agents',
          name: parts.slice(3).join('_'),
        };
      }
      return {
        prefix: parts[0],
        module: 'core',
        type: 'agents',
        name: parts.slice(agentIndex + 1).join('_'),
      };
    } else {
      return {
        prefix: parts[0],
        module: parts[1],
        type: 'agents',
        name: parts.slice(agentIndex + 1).join('_'),
      };
    }
  }

  if (parts.length === 2) {
    return {
      prefix: parts[0],
      module: 'core',
      type: 'workflows',
      name: parts[1],
    };
  }

  // Check for standalone non-agent: evo_standalone_name
  if (parts[1] === 'standalone') {
    return {
      prefix: parts[0],
      module: 'standalone',
      type: 'workflows',
      name: parts.slice(2).join('_'),
    };
  }

  return {
    prefix: parts[0],
    module: parts[1],
    type: 'workflows',
    name: parts.slice(2).join('_'),
  };
}

/**
 * Resolve the skill name for an artifact.
 * Prefers canonicalId from a evo-skill-manifest.yaml sidecar when available,
 * falling back to the path-derived name from toDashPath().
 *
 * @param {Object} artifact - Artifact object (must have relativePath; may have canonicalId)
 * @returns {string} Filename like 'evo-create-prd.md' or 'evo-agent-bmm-pm.md'
 */
function resolveSkillName(artifact) {
  if (artifact.canonicalId) {
    return `${artifact.canonicalId}.md`;
  }
  return toDashPath(artifact.relativePath);
}

// Backward compatibility aliases (colon format was same as underscore)
const toColonName = toUnderscoreName;
const toColonPath = toUnderscorePath;
const customAgentColonName = customAgentUnderscoreName;
const isColonFormat = isUnderscoreFormat;
const parseColonName = parseUnderscoreName;

module.exports = {
  // New standard (dash-based)
  toDashName,
  toDashPath,
  resolveSkillName,
  customAgentDashName,
  isDashFormat,
  parseDashName,

  // Legacy (underscore-based) - kept for backward compatibility
  toUnderscoreName,
  toUnderscorePath,
  customAgentUnderscoreName,
  isUnderscoreFormat,
  parseUnderscoreName,

  // Backward compatibility aliases
  toColonName,
  toColonPath,
  customAgentColonName,
  isColonFormat,
  parseColonName,

  TYPE_SEGMENTS,
  AGENT_SEGMENT,
  EVO_FOLDER_NAME,
};
