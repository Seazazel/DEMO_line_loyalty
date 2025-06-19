import { Client } from '@line/bot-sdk';
import { replyText } from '../functions/replyFunction';
import { handleCheckInstallment } from './handleCheckInstallment';
import { handleServiceCenter } from './handleServiceCenter';
import { handleInsurance } from './handleInsurance';
import { handleOther } from './handleOther';
import { handleRenewLicense, 
  handleRenewInsurance, 
  handleRenewOrBuyInsurance, 
  handleCheckLicenseNum, 
  handleRenewRegistration } from './handleInsuranceSubAction';


export async function handlePostbackMessage(
  client: Client,
  replyToken: string,
  action: string,
  item: string,
  params: Record<string, string>
): Promise<void> {
  switch (action) {
    case 'checkInstallment':
      await handleCheckInstallment(client, replyToken, params);
      break;

    case 'serviceCenter':
      await handleServiceCenter(client, replyToken, item);
      break;

    case 'insurance':
      await handleInsurance(client, replyToken, item);
      break;

    case 'other':
      await handleOther(client, replyToken, item);
      break;

    case 'checkLicenseNum':
      await handleCheckLicenseNum(client, replyToken, params);
      break;

    case 'renewLicense':
      await handleRenewLicense(client, replyToken, params);
      break;

    case 'renewInsurance':
      await handleRenewInsurance(client, replyToken, params);
      break;
      
    case 'renewOrBuyInsurance':
      await handleRenewOrBuyInsurance(client, replyToken, item, params);
      break;

      case 'renewRegistration':
      await handleRenewRegistration(client, replyToken, params);
      break;


    default:
      await replyText(client, replyToken, 'คำสั่งไม่ถูกต้อง');
      break;
  }
}
