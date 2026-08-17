const API_URL = "http://localhost:4000/api";

// =====================================================
// GET ALL ACCOUNTS
// =====================================================

export async function fetchAccounts() {
  const response = await fetch(
    `${API_URL}/accounts`
  );

  if (!response.ok) {
    throw new Error(
      `โหลด Accounts ไม่สำเร็จ (${response.status})`
    );
  }

  return response.json();
}

// =====================================================
// GET ONE ACCOUNT
// =====================================================

export async function fetchAccount(custNo) {
  const response = await fetch(
    `${API_URL}/accounts/${encodeURIComponent(custNo)}`
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.error ||
        `โหลด Account ไม่สำเร็จ (${response.status})`
    );
  }

  return response.json();
}

// =====================================================
// ADD NOTE
// =====================================================

export async function addNote(custNo, noteData) {
  const response = await fetch(
    `${API_URL}/accounts/${encodeURIComponent(
      custNo
    )}/notes`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(noteData),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.error ||
        `เพิ่ม Note ไม่สำเร็จ (${response.status})`
    );
  }

  return response.json();
}

// =====================================================
// UPDATE NOTE
// =====================================================

export async function updateNote(noteId, noteData) {
  const response = await fetch(
    `${API_URL}/notes/${encodeURIComponent(noteId)}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(noteData),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.error ||
        `แก้ไข Note ไม่สำเร็จ (${response.status})`
    );
  }

  return response.json();
}

// =====================================================
// UPDATE PAYMENT INFO
// =====================================================

export async function updatePayment(
  custNo,
  paymentData
) {
  const response = await fetch(
    `${API_URL}/accounts/${encodeURIComponent(
      custNo
    )}/payment`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(paymentData),
    }
  );

  if (!response.ok) {
    const data =
      await response.json().catch(() => null);

    throw new Error(
      data?.error ||
        data?.message ||
        `แก้ไขข้อมูลการชำระไม่สำเร็จ (${response.status})`
    );
  }

  return response.json();
}
// =====================================================
// DELETE COLLECTION NOTE
// DELETE /api/accounts/notes/:noteId
// =====================================================

export async function deleteNote(noteId) {
  const response = await fetch(
    `${API_URL}/accounts/notes/${noteId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.error || "ลบ Collection Note ไม่สำเร็จ"
    );
  }

  return response.json();
}
export async function login(username, password) {

  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "เข้าสู่ระบบไม่สำเร็จ"
    );
  }

  return data;
}