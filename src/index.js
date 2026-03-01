import api, { route } from '@forge/api';

export const handler = async (event, context) => {
  try {
    // 1️⃣ Get all boards
    const boardsResponse = await api.asApp().requestJira(
      route`/rest/agile/1.0/board`
    );
    const boardsData = await boardsResponse.json();

    if (!boardsData.values.length) {
      return { error: "No boards found" };
    }

    const boardId = boardsData.values[0].id;

    // 2️⃣ Get active sprint
    const sprintResponse = await api.asApp().requestJira(
      route`/rest/agile/1.0/board/${boardId}/sprint?state=active`
    );
    const sprintData = await sprintResponse.json();

    if (!sprintData.values.length) {
      return { message: "No active sprint" };
    }

    const sprintId = sprintData.values[0].id;

    // 3️⃣ Get sprint issues
    const issuesResponse = await api.asApp().requestJira(
      route`/rest/agile/1.0/sprint/${sprintId}/issue`
    );
    const issuesData = await issuesResponse.json();

    return {
      sprint: sprintData.values[0].name,
      issueCount: issuesData.issues.length,
    };

  } catch (error) {
    return { error: error.message };
  }
};