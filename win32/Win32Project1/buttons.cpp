#include "stdafx.h"

/**
* ��ť���
* BS_PUSHBUTTON: ָ��һ�����ť
* BS_CHECKBOX: ָ���ھ��ΰ�ť���Ҳ���б����ѡ��򣬲����Զ���ѡ
* WS_TABSTOP: tap������ͣ��������
*/

LRESULT CALLBACK myWndProc(HWND hwnd, UINT message, WPARAM wparam, LPARAM lparam)
{
	switch (message)
	{
	case WM_CREATE:
	{
		//�����ﴴ���Ӵ��ںͿؼ�

		//������ͨ��ť
		HWND hwnd_btn = CreateWindow(
			L"Button",
			L"��ͨ��ť",
			WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
			15, 5,
			100, 40,
			hwnd,//ָ��button��ť�ĸ�����
			(HMENU)10000, //�ؼ�ID�����menu,�ؼ�ID��Ψһ
			((LPCREATESTRUCT)lparam)->hInstance,
			NULL
		);

		//������ѡ��ť
		HWND hwnd_btn2 = CreateWindow(
			L"Button",
			L"��ѡ��ť",
			WS_CHILD | WS_VISIBLE | BS_AUTORADIOBUTTON,
			15, 50,
			100, 40,
			hwnd,//ָ��button��ť�ĸ�����
			(HMENU)10001, //�ؼ�ID�����menu,�ؼ�ID��Ψһ
			((LPCREATESTRUCT)lparam)->hInstance,
			NULL
		);

		//��ѡ��ť
		HWND hwnd_btn3 = CreateWindow(
			L"Button",
			L"��ѡ��ť",
			WS_CHILD | WS_VISIBLE | BS_AUTOCHECKBOX,
			15, 95,
			100, 40,
			hwnd,//ָ��button��ť�ĸ�����
			(HMENU)10002, //�ؼ�ID�����menu,�ؼ�ID��Ψһ
			((LPCREATESTRUCT)lparam)->hInstance,
			NULL
		);


		//���ʶ����Щ��ť�ĵ����Ϣ?

		//�������ť�ؼ���ʱ�򣬻��񸸴��ڷ���������ϢWM_COMMAND

		// BN_CLICKED: �û��ڰ�ť�ϵ������ʱ���񸸴��ڷ���BN_CLICKED��Ϣ.
		// BN_DOUBALECLICKED: ͬ�ϣ�����˫�� BN_DOUBLECLICKED��Ϣ.

	}
	break;
	case WM_CLOSE:
		DestroyWindow(hwnd);
		break;
	case WM_DESTROY:
		PostQuitMessage(0);
		break;
	case WM_COMMAND:
	{
		//���ݿؼ�ID����������
		switch (LOWORD(wparam))//���ֽ��ǿؼ�ID
		{
		case 10000:
			if (HIWORD(wparam) == BN_CLICKED) //��λ�ֽ��ǿؼ���������Ϣ����
			{
				MessageBox(hwnd, L"�������ͨ��ť!", L"��ʾ", MB_OK);
			}
			break;
		case 10001:
		{
			MessageBox(hwnd, L"����˵�ѡ��ť!", L"��ʾ", MB_OK);

			HWND hbutton_radio = (HWND)lparam;

			//��ȡ��ѡ��ť��ѡ��״̬
			if (SendMessage(hbutton_radio, BM_GETCHECK, 0, 0) == BST_CHECKED)
			{
				MessageBox(hwnd, L"��ѡ��ť��ѡ��!", L"��ʾ", MB_OK);
			}
			else if (SendMessage(hbutton_radio, BM_GETCHECK, 0, 0) == BST_UNCHECKED)
			{
				MessageBox(hwnd, L"��ѡ��ťû�б�ѡ��!", L"��ʾ", MB_OK);
			}

		}
		break;
		case 10002:
		{
			MessageBox(hwnd, L"����˸�ѡ��ť!", L"��ʾ", MB_OK);

			HWND  hbutton_check = (HWND)lparam;

			//��ȡ��ѡ���ѡ��״̬
			if (SendMessage(hbutton_check, BM_GETCHECK, 0, 0) == BST_CHECKED)
			{
				MessageBox(hwnd, L"��ѡ��ť��ѡ��!", L"��ʾ", MB_OK);
			}
			else if (SendMessage(hbutton_check, BM_GETCHECK, 0, 0) == BST_UNCHECKED)
			{
				MessageBox(hwnd, L"��ѡ��ťû�б�ѡ��!", L"��ʾ", MB_OK);
			}

		}
		break;
		default:
			break;
		}
	}
	break;
	default:
		break;
	}

	return DefWindowProc(hwnd, message, wparam, lparam);
}

int WINAPI WinMain(_In_ HINSTANCE hInstance, _In_opt_ HINSTANCE hPrevInstance, _In_ LPSTR lpCmdLine, _In_ int nShowCmd)
{
	//1.ע�ᴰ����
	WNDCLASS wnd;
	wnd.cbClsExtra = 0;
	wnd.cbWndExtra = 0;
	wnd.hbrBackground = (HBRUSH)GetStockObject(GRAY_BRUSH);
	wnd.hCursor = LoadCursor(hInstance, IDC_ARROW);
	wnd.hIcon = LoadIcon(hInstance, IDI_APPLICATION);
	wnd.lpszClassName = L"zhangkai";
	wnd.lpszMenuName = NULL;
	wnd.lpfnWndProc = myWndProc;
	wnd.style = CS_HREDRAW | CS_VREDRAW;
	wnd.hInstance = hInstance;

	int ec = RegisterClass(&wnd);
	if (ec == 0)
	{
		ec = GetLastError();
		return ec;
	}

	//2.��������
	HWND hwnd = CreateWindow(L"zhangkai", L"window title", WS_OVERLAPPEDWINDOW, 0, 0, 500, 500, NULL, NULL, hInstance, NULL);
	if (hwnd == NULL)
	{
		//create window file
		return 0;
	}

	ShowWindow(hwnd, nShowCmd);
	UpdateWindow(hwnd);


	//3.��Ϣѭ��

	MSG msg;
	while (GetMessage(&msg, NULL, 0, 0))
	{
		TranslateMessage(&msg);
		DispatchMessage(&msg);
	}


	return 0;
}
